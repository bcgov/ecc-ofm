# Selenium Testing

Instructions on how to install and run selenium tests

## Environment Setup - Eclipse IDE

**`Step 1`** Download JDK 21

**`Step 2`** Download the Eclipse IDE

**`Step 3`** On the Eclipse marketplace, install the **TestNG for Eclipse** plugin

## Run tests

First, rename the file `config.properties.template` to `config.properties`, then fill in the missing details with base64 string encoded values

**`Step 1`** Add any test class tag names to `src/test/resources/testNG.xml` that you would like to run

**`Step 2`** Right click on the file and run as testNG test. Or, you can run as Maven Test.
