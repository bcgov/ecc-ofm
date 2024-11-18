set "$zephyrBaseUrl=https://prod-api.zephyr4jiracloud.com/connect"

:: =========================================
::  Access and secret keys, and user id needed for connection to Zephyr for Jira.
:: =========================================

set "$accessKey=%accessKey%"
set "$secretKey=%secretKey%"
set "$accountId=%accountId%"

:: =========================================
::  Create a JSON Web Token (required to access Zephyr for Jira to create auotomation task).
:: =========================================

for /F "tokens=*" %%i in (' curl -s -X POST ^
	-H "Content-Type: application/json" ^
	--data "{ \"accessKey\":\"%$accessKey%\", \"secretKey\":\"%$secretKey%\",\"accountId\":\"%$accountId%\",\"zephyrBaseUrl\": \"%$zephyrBaseUrl%\",\"expirationTime\":360000}" "https://prod-vortexapi.zephyr4jiracloud.com/api/v1/jwt/generate" ')  do set jwtgenerated=%%i

set "$finaljwt=%jwtgenerated%"

:: =========================================
::  Properties of the automation task.
:: =========================================

:: Task info
set "$taskName=%taskName%"
set "$taskDescription=%taskDescription%"
set "$automationFramework=TestNG"
set "$projectKey=OFMCC"
set "$versionName=%versionName%"

:: Cycle info
set "$cycleName=%cycleName%"
set "$createNewCycle=false"
set "$appendDateTimeInCycleName=false"

:: Folder info
set "$folderName=%folderName%"
set "$createNewFolder=true"
set "$appendDateTimeInFolderName=false"
set "$assigneeUser=%accountId%"
set "$mandatoryFields={\"reporter\":{\"id\":\"%accountId%\",\"label\":\"%jiraAccountName%\",\"name\":\"%jiraAccountName%\"}}"

:: File path for results file
set "$resultPath=@\"%WORKSPACE%/target/surefire-reports/testng-results.xml\"

:: =========================================
::  Create an automation task, run it, send test results to Zephyr.
:: =========================================

curl -v -X POST  https://prod-vortexapi.zephyr4jiracloud.com/api/v1/automation/job/saveAndExecute ^
	-H "Content-Type: multipart/form-data" ^
	-H "Content-Type: application/json" ^
	-H "accessKey: %$accessKey%" ^
	-H "jwt: %$finaljwt%" ^
	-F "jobName=%$taskName%" ^
	-F "jobDescription=%$taskDescription%" ^
	-F "automationFramework=%$automationFramework%" ^
	-F "projectKey=%$projectKey%" ^
	-F "versionName=%$versionName%" ^
	-F "cycleName=%$cycleName%" ^
	-F "createNewCycle=%$createNewCycle%" ^
	-F "appendDateTimeInCycleName=%$appendDateTimeInCycleName%" ^
	-F "folderName=%$folderName%" ^
	-F "createNewFolder=%$createNewFolder%" ^
	-F "appendDateTimeInFolderName=%$appendDateTimeInFolderName%" ^
	-F "assigneeUser=%$assigneeUser%" ^
	-F "mandatoryFields=%$mandatoryFields%" ^
	-F "file=%$resultPath%"

:: =========================================
::  Get test case that was created by automation task
:: =========================================

:: Jira REST API authorization (required to access Jira to edit test case)
set "$jiraRestAPIAuth=%jiraRestAPIAuth%"

:: Gets the URL for the test case that was just created
for /f "delims=" %%i in ('powershell -Command "(Invoke-RestMethod -Uri 'https://eccbc.atlassian.net/rest/api/3/search?fields=key&maxResults=500&jql=type%%3D%%22Test%%22%%20and%%20labels%%3D%%22ZFJ_Automation%%22%%20and%%20updated%%3E%%3D%%22-1m%%22%%20and%%20reporter%%3DcurrentUser()' -Headers @{Authorization='Basic ' + [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes('%$jiraRestAPIAuth%'))}).issues[0].self"') do set issueSelf=%%i

set "$issueSelf=%issueSelf%"

:: =========================================
::  Attach test result screenshots to the Jira test case
:: =========================================

set "$imageDir=%WORKSPACE%/TestExecutionScreenshots"
 
for %%F in (%$imageDir%\*.png) do (
    echo Sending: %%F
    curl --location --request POST "%$issueSelf%/attachments" ^
         --user "%$jiraRestAPIAuth%" ^
         --header "X-Atlassian-Token: no-check" ^
         --form "file=@\"%%F\""
)

:: =========================================
::  Edit Jira test case details
:: =========================================

set "$JiraTestCaseJSONPayload={\"fields\": {\"summary\": \"%$taskName%\", \"description\": {\"type\": \"doc\",\"version\": 1,\"content\": [{\"type\": \"paragraph\",\"content\": [{\"type\": \"text\",\"text\": \"%$taskDescription%\"}]}]}}}"

curl -X PUT --url "%$issueSelf%" ^
	--user "%$jiraRestAPIAuth%" ^
	--header "Content-Type: application/json" ^
	--data "%$JiraTestCaseJSONPayload%"