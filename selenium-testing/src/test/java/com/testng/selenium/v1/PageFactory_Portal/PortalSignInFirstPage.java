package com.testng.selenium.v1.PageFactory_Portal;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

public class PortalSignInFirstPage {
	WebDriver driver;

	@FindBy(id = "bceid-login")
	WebElement button_BCeIdLogin;

	public PortalSignInFirstPage(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
	}

	public void clickOnBCeIdLogin() {
		button_BCeIdLogin.click();
	}
}
