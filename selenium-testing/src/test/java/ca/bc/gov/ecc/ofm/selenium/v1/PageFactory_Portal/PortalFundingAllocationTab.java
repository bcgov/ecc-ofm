package ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_Portal;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.CacheLookup;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class PortalFundingAllocationTab{
    private WebDriver driver;
    WebDriverWait wait;

    @FindBy(xpath = "//body/div[@id='app']/div[@id='app']/div[1]/main[1]/div[2]/div[1]/div[3]/div[1]/div[1]/div[3]/div[1]/div[2]/button[1]/span[3]/span[1]")
    @CacheLookup
    private WebElement requestToReallocateFunds ;

    public PortalFundingAllocationTab(WebDriver driver) {
        this.driver = driver;
        PageFactory.initElements(driver, this);
        wait = new WebDriverWait(driver, Duration.ofMillis(10000));
    }


    public void ClickReallocateFunds() throws InterruptedException {
        try {
            wait.until(ExpectedConditions.visibilityOf(requestToReallocateFunds));
            wait.until(ExpectedConditions.elementToBeClickable(requestToReallocateFunds)).click();
        }
        catch(Exception e) {
            System.out.println("Request to Re-allocate funds button is not available");
            driver.quit();
        }
    }
}
