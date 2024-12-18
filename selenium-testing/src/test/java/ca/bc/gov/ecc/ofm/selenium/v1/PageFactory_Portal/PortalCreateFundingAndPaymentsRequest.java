package ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_Portal;

import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.CacheLookup;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.WebDriverWait;
import java.time.Duration;

public class PortalCreateFundingAndPaymentsRequest {
    private WebDriver driver;
    WebDriverWait wait;

    @FindBy(xpath = "//input[@placeholder='[select a topic]']")
    @CacheLookup
    private WebElement selectTopic;

    @FindBy(xpath = "//input[@placeholder='Brief summary of request']")
    @CacheLookup
    private WebElement summary;

    @FindBy(xpath = "//textarea[@placeholder='Detailed description of request']")
    @CacheLookup
    private WebElement requestDescription;

    @FindBy(xpath = "//input[@type='file']")
    @CacheLookup
    private WebElement addFile;

    @FindBy(id = "add-new-file")
    @CacheLookup
    private WebElement addNewFileButton;

    @FindBy(xpath= "//input[@placeholder='Enter a description (Optional)']")
    @CacheLookup
    private WebElement description;

    @FindBy(id = "submit-new-request")
    @CacheLookup
    private WebElement submitNewRequestButton;

    public PortalCreateFundingAndPaymentsRequest(WebDriver driver) {
        this.driver = driver;
        PageFactory.initElements(driver, this);
        wait = new WebDriverWait(driver, Duration.ofMillis(10000));
    }

    private final String filePath = System.getProperty("user.dir") + "/src/test/resources/testFile.jpg";

    public void setTopic() {
        selectTopic.sendKeys("Payments and Funding");
    }

    public void setSummaryTextField(String summaryValue) {
        summary.sendKeys(summaryValue);
    }

    public void setRequestDescriptionTextField(String requestDescriptionValue) {
        requestDescription.sendKeys(requestDescriptionValue);
    }

    public void addNewFile() {
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", addNewFileButton);
        addFile.sendKeys(filePath);
        description.sendKeys("Funding Envelope Change Request file");
    }

    public void clickSubmitNewRequest() {
        submitNewRequestButton.click();
    }
}
