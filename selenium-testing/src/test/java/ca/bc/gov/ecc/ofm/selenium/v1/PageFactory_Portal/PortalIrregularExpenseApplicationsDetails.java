package ca.bc.gov.ecc.ofm.selenium.v1.PageFactory_Portal;

import java.time.Duration;
import org.openqa.selenium.support.CacheLookup;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class PortalIrregularExpenseApplicationsDetails {
	private WebDriver driver;
	
	@FindBy(id = "add-new-file")
	@CacheLookup
	private WebElement addNewFileButton;
	
	@FindBy(id = "submit-new-request")
	@CacheLookup
	private WebElement submitNewRequestButton;
	

	public PortalIrregularExpenseApplicationsDetails(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);

	}

	private final String filePath = System.getProperty("user.dir") + "/src/test/resources/testFile.jpg";
	
	public void setSubjectTextField(String subjectValue) {
		WebElement subject = driver.findElements(By.xpath("//*[contains(@id, 'input-')]")).get(4);
		subject.sendKeys(subjectValue);

	}

	public void setRequestDescriptionTextField(String requestDescriptionValue) {
		WebElement requestDescription = driver.findElements(By.xpath("//*[contains(@id, 'input-')]")).get(6);
		requestDescription.sendKeys(requestDescriptionValue);

	}
	
	public void addNewFile() {
		((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", addNewFileButton);
		
		WebElement addFile = driver.findElement(By.xpath("//*[contains(@id, 'input-') and @type ='file']"));
		addFile.sendKeys(filePath);
		
		WebElement description = driver.findElement(By.xpath("//*[@placeholder = 'Enter a description (Optional)']"));
		description.sendKeys("Irregular Expense application form");
	}
	
	public void clickSubmitNewRequest() {
		submitNewRequestButton.click();
	}
	
	public WebElement getaddNewFileButton() {
		return this.addNewFileButton;
	}
	
}
