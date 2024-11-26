package ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_Portal;

import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.CacheLookup;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class PortalFundingEnvelopeChangeRequest {
    private WebDriver driver;
    WebDriverWait wait;

    @FindBy(id = "add-new-file")
    @CacheLookup
    private WebElement addNewFileButton;

    @FindBy(id = "submit-new-request")
    @CacheLookup
    private WebElement submitNewRequestButton;

    @FindBy(id = "selectFacility")
    @CacheLookup
    private WebElement selectFacilityField;

    @FindBy(xpath = "//input[@placeholder='Brief summary of request']")
    @CacheLookup
    private WebElement summary;

    @FindBy(xpath = "//textarea[@placeholder='Detailed description of request']")
    @CacheLookup
    private WebElement requestDescription;

    @FindBy(xpath = "//input[@type='file']")
    @CacheLookup
    private WebElement addFile;

    @FindBy(xpath= "//input[@placeholder='Enter a description (Optional)']")
    @CacheLookup
    private WebElement description;

    public PortalFundingEnvelopeChangeRequest(WebDriver driver) {
        this.driver = driver;
        PageFactory.initElements(driver, this);
        wait = new WebDriverWait(driver, Duration.ofMillis(10000));
    }

    private final String filePath = System.getProperty("user.dir") + "/src/test/resources/testFile.jpg";

    public void setSummaryTextField(String summaryValue) {
        summary.sendKeys(summaryValue);

    }

    public void setRequestDescriptionTextField(String requestDescriptionValue) {
        requestDescription.sendKeys(requestDescriptionValue);
    }

    public void addFacility(String facility) {
        selectFacilityField.sendKeys(facility);
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
