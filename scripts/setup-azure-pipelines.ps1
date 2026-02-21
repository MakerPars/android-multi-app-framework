[CmdletBinding()]
param(
    [string]$OrganizationUrl = "https://dev.azure.com/oaslananka",
    [string]$ProjectName = "MobilAppProje",
    [string]$RepositoryName = "android-multi-app-framework",
    [string]$DefaultBranch = "main",
    [switch]$ConfigureSecrets,
    [switch]$PromptForMissingSecrets,
    [switch]$LoadFromDotEnv,
    [switch]$SkipLogin,
    [switch]$DryRun
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Write-Step {
    param([string]$Message)
    Write-Host "`n==> $Message" -ForegroundColor Cyan
}

function Invoke-Az {
    param(
        [Parameter(Mandatory = $true)]
        [string[]]$Args,
        [switch]$CaptureOutput
    )

    $joined = $Args -join " "
    if ($DryRun) {
        Write-Host "[DRY-RUN] az $joined" -ForegroundColor Yellow
        if ($CaptureOutput) { return "" }
        return
    }

    if ($CaptureOutput) {
        $output = (& az @Args 2>&1)
        if ($LASTEXITCODE -ne 0) {
            throw "az command failed: az $joined`n$output"
        }
        return ($output -join "`n").Trim()
    }

    & az @Args
    if ($LASTEXITCODE -ne 0) {
        throw "az command failed: az $joined"
    }
}

function Ensure-AzureDevOpsExtension {
    Write-Step "Ensuring azure-devops extension"
    try {
        Invoke-Az -Args @("extension", "show", "--name", "azure-devops", "--only-show-errors", "-o", "none")
    } catch {
        Invoke-Az -Args @("extension", "add", "--name", "azure-devops")
    }
}

function Ensure-Login {
    if ($SkipLogin) {
        Write-Host "Skipping login check (--SkipLogin)." -ForegroundColor DarkYellow
        return
    }

    Write-Step "Checking Azure login"
    try {
        $accountId = Invoke-Az -Args @("account", "show", "--query", "id", "-o", "tsv") -CaptureOutput
        if ([string]::IsNullOrWhiteSpace($accountId)) {
            throw "No Azure account context."
        }
        Write-Host "Azure account: $accountId" -ForegroundColor Green
    } catch {
        Write-Host "No active Azure login. Starting 'az login'..." -ForegroundColor Yellow
        Invoke-Az -Args @("login")
    }
}

function Get-PipelineId {
    param([Parameter(Mandatory = $true)][string]$PipelineName)

    $json = Invoke-Az -Args @(
        "pipelines", "list",
        "--name", $PipelineName,
        "--org", $OrganizationUrl,
        "--project", $ProjectName,
        "-o", "json"
    ) -CaptureOutput

    if ([string]::IsNullOrWhiteSpace($json)) { return $null }

    $items = @()
    try {
        $items = @($json | ConvertFrom-Json)
    } catch {
        throw "Failed to parse pipeline list JSON for '$PipelineName': $json"
    }

    if ($items.Count -eq 0) { return $null }

    $exact = $items | Where-Object { $_.name -eq $PipelineName } | Select-Object -First 1
    if ($null -eq $exact) {
        $exact = $items | Select-Object -First 1
    }

    if ($null -eq $exact -or $null -eq $exact.id) { return $null }
    return [string]$exact.id
}

function Ensure-Pipeline {
    param(
        [Parameter(Mandatory = $true)][string]$PipelineName,
        [Parameter(Mandatory = $true)][string]$YamlPath
    )

    if (-not (Test-Path -Path $YamlPath)) {
        throw "YAML file not found: $YamlPath"
    }

    $pipelineId = Get-PipelineId -PipelineName $PipelineName
    if ($null -eq $pipelineId) {
        Write-Step "Creating pipeline '$PipelineName' with '$YamlPath'"
        Invoke-Az -Args @(
            "pipelines", "create",
            "--name", $PipelineName,
            "--repository", $RepositoryName,
            "--repository-type", "tfsgit",
            "--branch", $DefaultBranch,
            "--yml-path", $YamlPath,
            "--skip-first-run", "true",
            "--org", $OrganizationUrl,
            "--project", $ProjectName,
            "-o", "none"
        )
        return
    }

    Write-Step "Updating pipeline '$PipelineName' (id: $pipelineId) with '$YamlPath'"
    Invoke-Az -Args @(
        "pipelines", "update",
        "--id", $pipelineId,
        "--branch", $DefaultBranch,
        "--yml-path", $YamlPath,
        "--org", $OrganizationUrl,
        "--project", $ProjectName,
        "-o", "none"
    )
}

function Test-VariableExists {
    param(
        [Parameter(Mandatory = $true)][string]$PipelineName,
        [Parameter(Mandatory = $true)][string]$VariableName
    )

    $json = Invoke-Az -Args @(
        "pipelines", "variable", "list",
        "--pipeline-name", $PipelineName,
        "--org", $OrganizationUrl,
        "--project", $ProjectName,
        "-o", "json"
    ) -CaptureOutput

    if ([string]::IsNullOrWhiteSpace($json) -or $json -eq "null") {
        return $false
    }

    $parsed = $null
    try {
        $parsed = $json | ConvertFrom-Json
    } catch {
        throw "Failed to parse variable list JSON for '$PipelineName': $json"
    }

    if ($null -eq $parsed) { return $false }

    # Azure DevOps CLI usually returns an object keyed by variable name.
    $propNames = @($parsed.PSObject.Properties.Name)
    return $propNames -contains $VariableName
}

function Set-PlainVariable {
    param(
        [Parameter(Mandatory = $true)][string]$PipelineName,
        [Parameter(Mandatory = $true)][string]$VariableName,
        [Parameter(Mandatory = $true)][string]$Value
    )

    if (Test-VariableExists -PipelineName $PipelineName -VariableName $VariableName) {
        Invoke-Az -Args @(
            "pipelines", "variable", "update",
            "--pipeline-name", $PipelineName,
            "--name", $VariableName,
            "--value", $Value,
            "--secret", "false",
            "--org", $OrganizationUrl,
            "--project", $ProjectName,
            "-o", "none"
        )
    } else {
        Invoke-Az -Args @(
            "pipelines", "variable", "create",
            "--pipeline-name", $PipelineName,
            "--name", $VariableName,
            "--value", $Value,
            "--secret", "false",
            "--org", $OrganizationUrl,
            "--project", $ProjectName,
            "-o", "none"
        )
    }
}

function Set-SecretVariable {
    param(
        [Parameter(Mandatory = $true)][string]$PipelineName,
        [Parameter(Mandatory = $true)][string]$VariableName,
        [Parameter(Mandatory = $true)][string]$Value
    )

    $envName = "AZURE_DEVOPS_EXT_PIPELINE_VAR_$VariableName"
    $oldValue = [Environment]::GetEnvironmentVariable($envName, "Process")

    [Environment]::SetEnvironmentVariable($envName, $Value, "Process")
    try {
        if (Test-VariableExists -PipelineName $PipelineName -VariableName $VariableName) {
            Invoke-Az -Args @(
                "pipelines", "variable", "update",
                "--pipeline-name", $PipelineName,
                "--name", $VariableName,
                "--secret", "true",
                "--prompt-value", "true",
                "--org", $OrganizationUrl,
                "--project", $ProjectName,
                "-o", "none"
            )
        } else {
            Invoke-Az -Args @(
                "pipelines", "variable", "create",
                "--pipeline-name", $PipelineName,
                "--name", $VariableName,
                "--secret", "true",
                "--org", $OrganizationUrl,
                "--project", $ProjectName,
                "-o", "none"
            )
        }
    } finally {
        [Environment]::SetEnvironmentVariable($envName, $oldValue, "Process")
    }
}

function Read-DotEnv {
    param([string]$Path)

    $values = @{}
    if (-not (Test-Path -Path $Path)) {
        return $values
    }

    foreach ($line in Get-Content -Path $Path) {
        $trimmed = $line.Trim()
        if ([string]::IsNullOrWhiteSpace($trimmed)) { continue }
        if ($trimmed.StartsWith("#")) { continue }

        $idx = $trimmed.IndexOf("=")
        if ($idx -lt 1) { continue }

        $k = $trimmed.Substring(0, $idx).Trim()
        $v = $trimmed.Substring($idx + 1).Trim()
        $v = $v.Trim("'").Trim('"')
        $values[$k] = $v
    }

    return $values
}

function Resolve-SecretValue {
    param(
        [Parameter(Mandatory = $true)][string]$SecretName,
        [hashtable]$DotEnvValues
    )

    $value = [Environment]::GetEnvironmentVariable($SecretName, "Process")
    if ([string]::IsNullOrWhiteSpace($value)) {
        $value = [Environment]::GetEnvironmentVariable($SecretName, "User")
    }
    if ([string]::IsNullOrWhiteSpace($value)) {
        $value = [Environment]::GetEnvironmentVariable($SecretName, "Machine")
    }
    if ([string]::IsNullOrWhiteSpace($value) -and $null -ne $DotEnvValues -and $DotEnvValues.ContainsKey($SecretName)) {
        $value = [string]$DotEnvValues[$SecretName]
    }

    # Convenience conversions from .env file-based values.
    if ([string]::IsNullOrWhiteSpace($value) -and $null -ne $DotEnvValues) {
        if ($SecretName -eq "KEYSTORE_BASE64" -and $DotEnvValues.ContainsKey("KEYSTORE_FILE")) {
            $keystorePath = [string]$DotEnvValues["KEYSTORE_FILE"]
            if (-not [string]::IsNullOrWhiteSpace($keystorePath) -and (Test-Path -Path $keystorePath)) {
                try {
                    $bytes = [System.IO.File]::ReadAllBytes($keystorePath)
                    $value = [Convert]::ToBase64String($bytes)
                } catch {
                    throw "Failed to read/encode KEYSTORE_FILE from .env: $keystorePath"
                }
            }
        }

        if ($SecretName -eq "PLAY_SERVICE_ACCOUNT_JSON" -and $DotEnvValues.ContainsKey("PLAY_SERVICE_ACCOUNT_JSON")) {
            $svcValue = [string]$DotEnvValues["PLAY_SERVICE_ACCOUNT_JSON"]
            if (-not [string]::IsNullOrWhiteSpace($svcValue) -and (Test-Path -Path $svcValue)) {
                try {
                    $value = Get-Content -Path $svcValue -Raw
                } catch {
                    throw "Failed to read PLAY_SERVICE_ACCOUNT_JSON file from .env path: $svcValue"
                }
            }
        }
    }

    if ([string]::IsNullOrWhiteSpace($value) -and $PromptForMissingSecrets) {
        $value = Read-Host -Prompt "Enter value for $SecretName"
    }

    return $value
}

$pipelines = @(
    @{
        Name = "quality-gate"
        Yaml = "pipelines/azure-pipelines.yml"
        PlainVariables = @{}
    },
    @{
        Name = "manual-ops"
        Yaml = "pipelines/azure-pipelines-manual.yml"
        PlainVariables = @{}
    },
    @{
        Name = "release"
        Yaml = "pipelines/azure-pipelines-release.yml"
        PlainVariables = @{
            PUBLISH_TO_PLAY  = "false"
        }
    }
)

$secretNames = @(
    "KEYSTORE_BASE64",
    "KEYSTORE_PASSWORD",
    "KEY_ALIAS",
    "KEY_PASSWORD",
    "PLAY_SERVICE_ACCOUNT_JSON",
    "FIREBASE_CONFIGS_ZIP_BASE64"
)

Write-Step "Azure Pipelines bootstrap started"
Ensure-AzureDevOpsExtension
Ensure-Login

$dotEnvValues = @{}
if ($LoadFromDotEnv) {
    Write-Step "Loading values from .env"
    $dotEnvValues = Read-DotEnv -Path ".env"
}

foreach ($pipeline in $pipelines) {
    Ensure-Pipeline -PipelineName $pipeline.Name -YamlPath $pipeline.Yaml

    foreach ($entry in $pipeline.PlainVariables.GetEnumerator()) {
        Write-Host "Setting variable '$($entry.Key)' on '$($pipeline.Name)'" -ForegroundColor Gray
        Set-PlainVariable -PipelineName $pipeline.Name -VariableName $entry.Key -Value ([string]$entry.Value)
    }

    if ($ConfigureSecrets) {
        foreach ($secretName in $secretNames) {
            $secretValue = Resolve-SecretValue -SecretName $secretName -DotEnvValues $dotEnvValues
            if ([string]::IsNullOrWhiteSpace($secretValue)) {
                Write-Host "Skipping secret '$secretName' for '$($pipeline.Name)' (no value provided)." -ForegroundColor DarkYellow
                continue
            }

            Write-Host "Setting secret '$secretName' on '$($pipeline.Name)'" -ForegroundColor Gray
            Set-SecretVariable -PipelineName $pipeline.Name -VariableName $secretName -Value $secretValue
        }
    }
}

Write-Host "`nSetup completed." -ForegroundColor Green
