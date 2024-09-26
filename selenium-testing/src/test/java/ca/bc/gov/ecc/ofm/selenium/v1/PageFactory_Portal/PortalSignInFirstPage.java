package ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_Portal;

import java.time.Duration;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class PortalSignInFirstPage {
	WebDriver driver;
	WebDriverWait wait;

	@FindBy(id = "bceid-login")
	WebElement button_BCeIdLogin;

	public PortalSignInFirstPage(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
		wait = new WebDriverWait(driver,  Duration.ofMillis(10000));
	}

	public void clickOnBCeIdLogin() {
		wait.until(ExpectedConditions.presenceOfElementLocated(By.id("bceid-login")));
		button_BCeIdLogin.click();
	}
}
