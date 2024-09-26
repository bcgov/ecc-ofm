package ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_Portal;

import java.time.Duration;
import java.util.List;
import java.util.Map;
import org.openqa.selenium.support.CacheLookup;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class ApplicationsHomePage {
    private WebDriver driver;


    @FindBy(id = "supp-allowances-button")
    @CacheLookup
    private WebElement addAllowancesApplication;

    @FindBy(id = "irregular-expense-button")
    @CacheLookup
    private WebElement addIrregularExpensesFundingApplication;

    @FindBy(id = "core-application-button")
    @CacheLookup
    private WebElement addOfmApplication;

    public ApplicationsHomePage(WebDriver driver) {
        this.driver = driver;
    }

    /**
     * Click on Add Allowances Application Link.
     *
     * @return the ApplicationsHomePage class instance.
     */
    public void clickAddAllowancesApplicationLink() {
        addAllowancesApplication.click();
    }

    /**
     * Click on Add Irregular Expenses Funding Application Button.
     *
     * @return the ApplicationsHomePage class instance.
     */
    public void clickAddIrregularExpensesFundingApplicationButton() {
        addIrregularExpensesFundingApplication.click();
    }

    /**
     * Click on Add OFM Application Link.
     *
     * @return the ApplicationsHomePage class instance.
     */
    public void clickAddOfmApplicationLink() {
        addOfmApplication.click();
    }

}
