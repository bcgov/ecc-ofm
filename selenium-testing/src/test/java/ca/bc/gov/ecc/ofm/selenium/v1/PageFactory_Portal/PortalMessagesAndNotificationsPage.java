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

public class PortalMessagesAndNotificationsPage {
	WebDriver driver;
	WebDriverWait wait;
	
	@FindBy(xpath = "//*[contains(text(), 'Action Required') or contains(text(), 'Open')]")
	WebElement message;
	
	@FindBy(xpath = "//*[@value='notifications']")
	WebElement notificationsTab;
	
	@FindBy(xpath = "//div[contains(text(), 'Read') or contains(text(), 'Unread')]")
	WebElement notification;

	public PortalMessagesAndNotificationsPage(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
		wait = new WebDriverWait(driver, Duration.ofMillis(10000));
	}
	
	public void clickOnMessage() {
		wait.until(ExpectedConditions.elementToBeClickable(message)).click();
	}
	
	public void clickOnNotificationTab() {
		wait.until(ExpectedConditions.elementToBeClickable(notificationsTab)).click();
	}
	
	public void clickOnNotification() {
		wait.until(ExpectedConditions.elementToBeClickable(notification)).click();
	}
}