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
    private Map<String, String> data;
    private WebDriver driver;
    private int timeout = 15;

    @FindBy(id = "mail_box_button")
    @CacheLookup
    private WebElement _29;

    @FindBy(id = "footer-about")
    @CacheLookup
    private WebElement aboutGovBcCa;

    @FindBy(id = "footer-accessibility")
    @CacheLookup
    private WebElement accessibility;

    @FindBy(id = "supp-allowances-button")
    @CacheLookup
    private WebElement addAllowancesApplication;

    @FindBy(id = "irregular-expense-button")
    @CacheLookup
    private WebElement addIrregularExpensesFundingApplication;

    @FindBy(id = "core-application-button")
    @CacheLookup
    private WebElement addOfmApplication;

    @FindBy(id = "input-153")
    @CacheLookup
    private WebElement applicationsaddNewApplicationbeforeStartingAnApplication;

    @FindBy(css = "#app div.v-application__wrap div.app-header header:nth-of-type(1) div.v-toolbar__content div.v-container.v-container--fluid.v-locale--is-ltr div.v-row div:nth-of-type(1) a")
    @CacheLookup
    private WebElement bCGovernmentLogo;

    @FindBy(id = "back-home-button")
    @CacheLookup
    private WebElement backToHome;

    @FindBy(id = "footer-contact")
    @CacheLookup
    private WebElement contactUs;

    @FindBy(id = "footer-copyright")
    @CacheLookup
    private WebElement copyright;

    @FindBy(id = "footer-disclaimer")
    @CacheLookup
    private WebElement disclaimer;

    @FindBy(id = "facility-filter-button")
    @CacheLookup
    private WebElement filterByFacility;

    @FindBy(id = "footer-home")
    @CacheLookup
    private WebElement home;

    @FindBy(id = "input-157")
    @CacheLookup
    private WebElement itemsPerPage1012Of2;

    private final String pageLoadedText = "You must have an active OFM application for the facility to apply for Allowances";

    private final String pageUrl = "/applications/applications-history";

    @FindBy(id = "footer-privacy")
    @CacheLookup
    private WebElement privacy;

    @FindBy(css = "a[href='/applications/ebae9000-e345-ef11-a316-6045bd5b7fe1/facility-details']")
    @CacheLookup
    private WebElement viewApplication1;

    @FindBy(css = "a[href='/applications/e766d06b-f645-ef11-a316-002248b372e9/facility-details']")
    @CacheLookup
    private WebElement viewApplication2;

    public ApplicationsHomePage() {
    }

    public ApplicationsHomePage(WebDriver driver) {
        this();
        this.driver = driver;
    }

    public ApplicationsHomePage(WebDriver driver, Map<String, String> data) {
        this(driver);
        this.data = data;
    }

    public ApplicationsHomePage(WebDriver driver, Map<String, String> data, int timeout) {
        this(driver, data);
        this.timeout = timeout;
    }

    /**
     * Click on About Gov.bc.ca Link.
     *
     * @return the ApplicationsHomePage class instance.
     */
    public ApplicationsHomePage clickAboutGovBcCaLink() {
        aboutGovBcCa.click();
        return this;
    }

    /**
     * Click on Accessibility Link.
     *
     * @return the ApplicationsHomePage class instance.
     */
    public ApplicationsHomePage clickAccessibilityLink() {
        accessibility.click();
        return this;
    }

    /**
     * Click on Add Allowances Application Link.
     *
     * @return the ApplicationsHomePage class instance.
     */
    public ApplicationsHomePage clickAddAllowancesApplicationLink() {
        addAllowancesApplication.click();
        return this;
    }

    /**
     * Click on Add Irregular Expenses Funding Application Button.
     *
     * @return the ApplicationsHomePage class instance.
     */
    public ApplicationsHomePage clickAddIrregularExpensesFundingApplicationButton() {
        addIrregularExpensesFundingApplication.click();
        return this;
    }

    /**
     * Click on Add Ofm Application Link.
     *
     * @return the ApplicationsHomePage class instance.
     */
    public ApplicationsHomePage clickAddOfmApplicationLink() {
        addOfmApplication.click();
        return this;
    }

    /**
     * Click on B.c. Government Logo Link.
     *
     * @return the ApplicationsHomePage class instance.
     */
    public ApplicationsHomePage clickBCGovernmentLogoLink() {
        bCGovernmentLogo.click();
        return this;
    }

    /**
     * Click on Back To Home Link.
     *
     * @return the ApplicationsHomePage class instance.
     */
    public ApplicationsHomePage clickBackToHomeLink() {
        backToHome.click();
        return this;
    }

    /**
     * Click on 29 Button.
     *
     * @return the ApplicationsHomePage class instance.
     */
    public ApplicationsHomePage clickButton29() {
        _29.click();
        return this;
    }

    /**
     * Click on Contact Us Link.
     *
     * @return the ApplicationsHomePage class instance.
     */
    public ApplicationsHomePage clickContactUsLink() {
        contactUs.click();
        return this;
    }

    /**
     * Click on Copyright Link.
     *
     * @return the ApplicationsHomePage class instance.
     */
    public ApplicationsHomePage clickCopyrightLink() {
        copyright.click();
        return this;
    }

    /**
     * Click on Disclaimer Link.
     *
     * @return the ApplicationsHomePage class instance.
     */
    public ApplicationsHomePage clickDisclaimerLink() {
        disclaimer.click();
        return this;
    }

    /**
     * Click on Filter By Facility Button.
     *
     * @return the ApplicationsHomePage class instance.
     */
    public ApplicationsHomePage clickFilterByFacilityButton() {
        filterByFacility.click();
        return this;
    }

    /**
     * Click on Home Link.
     *
     * @return the ApplicationsHomePage class instance.
     */
    public ApplicationsHomePage clickHomeLink() {
        home.click();
        return this;
    }

    /**
     * Click on Privacy Link.
     *
     * @return the ApplicationsHomePage class instance.
     */
    public ApplicationsHomePage clickPrivacyLink() {
        privacy.click();
        return this;
    }

    /**
     * Click on View Application Link.
     *
     * @return the ApplicationsHomePage class instance.
     */
    public ApplicationsHomePage clickViewApplication1Link() {
        viewApplication1.click();
        return this;
    }

    /**
     * Click on View Application Link.
     *
     * @return the ApplicationsHomePage class instance.
     */
    public ApplicationsHomePage clickViewApplication2Link() {
        viewApplication2.click();
        return this;
    }

    /**
     * Fill every fields in the page.
     *
     * @return the ApplicationsHomePage class instance.
     */
    public ApplicationsHomePage fill() {
        setApplicationsaddNewApplicationbeforeStartingAnApplicationTextField();
        setItemsPerPage1012Of2TextField();
        return this;
    }

    /**
     * Set default value to Applicationsadd New Applicationbefore Starting An Application Verify Your Organization And Facility Details In Account Management Text field.
     *
     * @return the ApplicationsHomePage class instance.
     */
    public ApplicationsHomePage setApplicationsaddNewApplicationbeforeStartingAnApplicationTextField() {
        return setApplicationsaddNewApplicationbeforeStartingAnApplicationTextField(data.get("APPLICATIONSADD_NEW_APPLICATIONBEFORE_STARTING_AN_APPLICATION"));
    }

    /**
     * Set value to Applicationsadd New Applicationbefore Starting An Application Verify Your Organization And Facility Details In Account Management Text field.
     *
     * @return the ApplicationsHomePage class instance.
     */
    public ApplicationsHomePage setApplicationsaddNewApplicationbeforeStartingAnApplicationTextField(String applicationsaddNewApplicationbeforeStartingAnApplicationValue) {
        applicationsaddNewApplicationbeforeStartingAnApplication.sendKeys(applicationsaddNewApplicationbeforeStartingAnApplicationValue);
        return this;
    }

    /**
     * Set default value to Items Per Page1012 Of 2 Text field.
     *
     * @return the ApplicationsHomePage class instance.
     */
    public ApplicationsHomePage setItemsPerPage1012Of2TextField() {
        return setItemsPerPage1012Of2TextField(data.get("ITEMS_PER_PAGE1012_OF_2"));
    }

    /**
     * Set value to Items Per Page1012 Of 2 Text field.
     *
     * @return the ApplicationsHomePage class instance.
     */
    public ApplicationsHomePage setItemsPerPage1012Of2TextField(String itemsPerPage1012Of2Value) {
        itemsPerPage1012Of2.sendKeys(itemsPerPage1012Of2Value);
        return this;
    }

    /**
     * Verify that the page loaded completely.
     *
     * @return the ApplicationsHomePage class instance.
     */
    public ApplicationsHomePage verifyPageLoaded() {
        (new WebDriverWait(driver, Duration.ofSeconds(timeout))).until(new ExpectedCondition<Boolean>() {
            public Boolean apply(WebDriver d) {
                return d.getPageSource().contains(pageLoadedText);
            }
        });
        return this;
    }

    /**
     * Verify that current page URL matches the expected URL.
     *
     * @return the ApplicationsHomePage class instance.
     */
    public ApplicationsHomePage verifyPageUrl() {
        (new WebDriverWait(driver, Duration.ofSeconds(timeout))).until(new ExpectedCondition<Boolean>() {
            public Boolean apply(WebDriver d) {
                return d.getCurrentUrl().contains(pageUrl);
            }
        });
        return this;
    }
}
