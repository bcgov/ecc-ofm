package ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_Portal;

import java.time.Duration;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class PortalHomePage {
	WebDriver driver;
	WebDriverWait wait;
	
	@FindBy(id = "applications-card")
	WebElement box_Applications;
	
	@FindBy(xpath = "//*[contains(text(), '" + "Log Out" + "')]")
	WebElement logout;
	
	@FindBy(id = "login-button")
	WebElement login;
	
	@FindBy(xpath = "//*[@aria-label='Home']")
	WebElement home;
	
	@FindBy(id = "reporting-card")
	WebElement reportTile;
	
	@FindBy(id = "funding-card")
	WebElement fundingTile;
	
	@FindBy(id = "account-mgmt-card")
	WebElement accountManagementTile;
	
	@FindBy(id = "assistance-card")
	WebElement assistanceRequestTile;
	
	@FindBy(id = "cancel-new-request")
	WebElement cancelAssistanceRequestButton;
	
	@FindBy(id = "footer-home")
	WebElement footerHomeButton;
	
	@FindBy(id = "footer-about")
	WebElement footerAboutButton;
	
	@FindBy(id = "footer-disclaimer")
	WebElement footerDisclaimerButton;
	
	@FindBy(id = "footer-privacy")
	WebElement footerPrivacyButton;
	
	@FindBy(id = "footer-accessibility")
	WebElement footerAccessibilityButton;
	
	@FindBy(id = "footer-copyright")
	WebElement footerCopyrightButton;
	
	@FindBy(id = "footer-contact")
	WebElement footerContactButton;
	
	@FindBy(xpath = "//*[@aria-label='Messages/Notifications']")
	WebElement messagesAndNotificationsButton;
	
	@FindBy(xpath = "//*[@aria-label='User Menu']")
	WebElement userProfile;
	
	@FindBy(id = "impersonate_button")
	WebElement ImpersonateButton;
	

	public PortalHomePage(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
		wait = new WebDriverWait(driver, Duration.ofMillis(10000));
	}

	public void clickOnApplicationBox() {
		((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", box_Applications);
		wait.until(ExpectedConditions.elementToBeClickable(box_Applications)).click();
	}
	
	public void clickOnUsername() {
        wait.until(ExpectedConditions.elementToBeClickable(userProfile)).click();
	}
	
	public void logout() {
		wait.until(ExpectedConditions.elementToBeClickable(logout));
		logout.click();			
	}
	
	public void login() {
		wait.until(ExpectedConditions.elementToBeClickable(login)).click();
	}
	
	public void home() {
		wait.until(ExpectedConditions.elementToBeClickable(home)).click();
	}
	
	public void clickReportTile() {
		((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", reportTile);
		wait.until(ExpectedConditions.elementToBeClickable(reportTile)).click();
	}
	
	public void clickFundingTile() {
		((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", fundingTile);
		wait.until(ExpectedConditions.elementToBeClickable(fundingTile)).click();
	}
	
	public void clickAccountManagementTile() {
		((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", accountManagementTile);
		wait.until(ExpectedConditions.elementToBeClickable(accountManagementTile)).click();
	}
	
	public void clickAssistanceRequestTile() {
		((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", assistanceRequestTile);
		wait.until(ExpectedConditions.elementToBeClickable(assistanceRequestTile)).click();
	}
	
	public void exitOutOfAssistanceRequest() {
		((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", cancelAssistanceRequestButton);
		wait.until(ExpectedConditions.elementToBeClickable(cancelAssistanceRequestButton)).click();
	}
	
	public void clickFooterHome() {
		((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", footerHomeButton);
		wait.until(ExpectedConditions.elementToBeClickable(footerHomeButton)).click();
	}
	
	public void clickFooterAbout() {
		((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", footerAboutButton);
		wait.until(ExpectedConditions.elementToBeClickable(footerAboutButton)).click();
	}
	
	public void clickFooterDisclaimer() {
		((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", footerDisclaimerButton);
		wait.until(ExpectedConditions.elementToBeClickable(footerDisclaimerButton)).click();
	}
	
	public void clickFooterPrivacy() {
		((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", footerPrivacyButton);
		wait.until(ExpectedConditions.elementToBeClickable(footerPrivacyButton)).click();
	}
	
	public void clickFooterAccessibility() {
		((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", footerAccessibilityButton);
		wait.until(ExpectedConditions.elementToBeClickable(footerAccessibilityButton)).click();
	}
	
	public void clickFooterCopyright() {
		((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", footerCopyrightButton);
		wait.until(ExpectedConditions.elementToBeClickable(footerCopyrightButton)).click();
	}
	
	public void clickFooterContact() {
		((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", footerContactButton);
		wait.until(ExpectedConditions.elementToBeClickable(footerContactButton)).click();
	}
	
	public void clickBackArrow(WebDriver driver) {
		driver.navigate().back();
	}
	
	public void clickMessagesAndNotifications() {
		wait.until(ExpectedConditions.elementToBeClickable(messagesAndNotificationsButton)).click();
	}
	
	public void clickImpersonate() {
		wait.until(ExpectedConditions.elementToBeClickable(ImpersonateButton)).click();
	}
}
