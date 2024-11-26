package ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_Portal;

import org.openqa.selenium.support.CacheLookup;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class PortalFundingPage {

    private WebDriver driver;
    WebDriverWait wait;


    @FindBy(xpath = "//strong[contains(text(),'Funding Agreements')]")
    @CacheLookup
    private WebElement fundingAgreementsTab;

    @FindBy(xpath = "//strong[contains(text(),'Payment Records')]")
    @CacheLookup
    private WebElement paymentRecordsTab;

    @FindBy(xpath = "//strong[contains(text(),'Funding Allocation')]")
    @CacheLookup
    private WebElement fundingAllocationTab;

    public PortalFundingPage(WebDriver driver) {
        this.driver = driver;
        PageFactory.initElements(driver, this);
        wait = new WebDriverWait(driver, Duration.ofMillis(10000));
    }
    
    public void clickOnFundingAgreementsTab() {
        wait.until(ExpectedConditions.elementToBeClickable(fundingAgreementsTab)).click();
    }
    public void clickOnPaymentRecordsTab() {;
        wait.until(ExpectedConditions.elementToBeClickable(paymentRecordsTab)).click();
    }
    public void clickOnFundingAllocationTab() {
        wait.until(ExpectedConditions.elementToBeClickable(fundingAllocationTab)).click();
    }

}
