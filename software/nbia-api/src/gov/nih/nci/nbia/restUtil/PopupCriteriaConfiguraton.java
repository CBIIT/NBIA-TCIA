package gov.nih.nci.nbia.restUtil;

import java.util.*;
import org.codehaus.jackson.map.annotate.*;

@JsonSerialize(include=JsonSerialize.Inclusion.NON_NULL)

public class PopupCriteriaConfiguraton {

	  private String dynamicQueryCriteriaAllAnyType;
	  private String dynamicQueryCriteriaAllAnyDefault;
	  private Boolean dynamicQueryCriteriaAllowNoChoice;
	  private String dynamicQueryCriteriaAndOrDefault;
	  private String dynamicQueryCriteriaAndOrType;
	  private Boolean dynamicQueryCriteriaApplyButton;
	  private Boolean dynamicQueryCriteriaApplyCheckbox;
	  private String dynamicQueryCriteriaApplyText;
	  private Boolean dynamicQueryCriteriaCalendar;
	  private String dynamicQueryCriteriaCalendarPlaceHolder0;
	  private String dynamicQueryCriteriaCalendarPlaceHolder1;
	  private String dynamicQueryCriteriaCalendarPrompt0;
	  private String dynamicQueryCriteriaCalendarPrompt1;
	  private Boolean dynamicQueryCriteriaClearButton;
	  private String dynamicQueryCriteriaHeading;
	  private Boolean dynamicQueryCriteriaLargeTextInput;
	  List<String> dynamicQueryCriteriaListData = new ArrayList<String>();
	  private Boolean dynamicQueryCriteriaMultiChoiceList;
	  private Boolean dynamicQueryCriteriaNumber;
	  private Integer dynamicQueryCriteriaNumberDefault;
	  private Integer dynamicQueryCriteriaNumberLimitHigh;
	  private Integer dynamicQueryCriteriaNumberLimitLow;
	  private Boolean dynamicQueryCriteriaOpenCloseButton;
	  private Boolean dynamicQueryCriteriaRequired;
	  private Boolean dynamicQueryCriteriaSearchable;
	  private Boolean dynamicQueryCriteriaSelectionInHeadingCollapsed;
	  private Boolean dynamicQueryCriteriaSingleCheckbox;
	  private Boolean dynamicQueryCriteriaSingleCheckboxDefault;
	  private String dynamicQueryCriteriaSingleChoiceList;
	  private String dynamicQueryCriteriaSingleLineRadio;
	  private String dynamicQueryCriteriaSingleLineRadio0;
	  private String dynamicQueryCriteriaSingleLineRadio1;
	  private String dynamicQueryCriteriaSingleLineRadio2;
	  private Integer dynamicQueryCriteriaSingleLineRadioDefault;
	  private Boolean dynamicQueryCriteriaSmallTextInput;
	  private Boolean dynamicQueryCriteriaSort;
	  private String dynamicQueryCriteriaSubHeading;


	 // Getter Methods 

	  public String getDynamicQueryCriteriaAllAnyType() {
	    return dynamicQueryCriteriaAllAnyType;
	  }

	  public Boolean getDynamicQueryCriteriaAllowNoChoice() {
	    return dynamicQueryCriteriaAllowNoChoice;
	  }

	  public String getDynamicQueryCriteriaAndOrDefault() {
	    return dynamicQueryCriteriaAndOrDefault;
	  }

	  public String getDynamicQueryCriteriaAndOrType() {
	    return dynamicQueryCriteriaAndOrType;
	  }

	  public Boolean getDynamicQueryCriteriaApplyButton() {
	    return dynamicQueryCriteriaApplyButton;
	  }

	  public Boolean getDynamicQueryCriteriaApplyCheckbox() {
	    return dynamicQueryCriteriaApplyCheckbox;
	  }

	  public String getDynamicQueryCriteriaApplyText() {
	    return dynamicQueryCriteriaApplyText;
	  }

	  public Boolean getDynamicQueryCriteriaCalendar() {
	    return dynamicQueryCriteriaCalendar;
	  }

	  public String getDynamicQueryCriteriaCalendarPlaceHolder0() {
	    return dynamicQueryCriteriaCalendarPlaceHolder0;
	  }

	  public String getDynamicQueryCriteriaCalendarPlaceHolder1() {
	    return dynamicQueryCriteriaCalendarPlaceHolder1;
	  }

	  public String getDynamicQueryCriteriaCalendarPrompt0() {
	    return dynamicQueryCriteriaCalendarPrompt0;
	  }

	  public String getDynamicQueryCriteriaCalendarPrompt1() {
	    return dynamicQueryCriteriaCalendarPrompt1;
	  }

	  public Boolean getDynamicQueryCriteriaClearButton() {
	    return dynamicQueryCriteriaClearButton;
	  }

	  public String getDynamicQueryCriteriaHeading() {
	    return dynamicQueryCriteriaHeading;
	  }

	  public Boolean getDynamicQueryCriteriaLargeTextInput() {
	    return dynamicQueryCriteriaLargeTextInput;
	  }

	  public Boolean getDynamicQueryCriteriaMultiChoiceList() {
	    return dynamicQueryCriteriaMultiChoiceList;
	  }

	  public Boolean getDynamicQueryCriteriaNumber() {
	    return dynamicQueryCriteriaNumber;
	  }

	  public Integer getDynamicQueryCriteriaNumberDefault() {
	    return dynamicQueryCriteriaNumberDefault;
	  }

	  public Integer getDynamicQueryCriteriaNumberLimitHigh() {
	    return dynamicQueryCriteriaNumberLimitHigh;
	  }

	  public Integer getDynamicQueryCriteriaNumberLimitLow() {
	    return dynamicQueryCriteriaNumberLimitLow;
	  }

	  public Boolean getDynamicQueryCriteriaOpenCloseButton() {
	    return dynamicQueryCriteriaOpenCloseButton;
	  }

	  public Boolean getDynamicQueryCriteriaRequired() {
	    return dynamicQueryCriteriaRequired;
	  }

	  public Boolean getDynamicQueryCriteriaSearchable() {
	    return dynamicQueryCriteriaSearchable;
	  }

	  public Boolean getDynamicQueryCriteriaSelectionInHeadingCollapsed() {
	    return dynamicQueryCriteriaSelectionInHeadingCollapsed;
	  }

	  public Boolean getDynamicQueryCriteriaSingleCheckbox() {
	    return dynamicQueryCriteriaSingleCheckbox;
	  }

	  public Boolean getDynamicQueryCriteriaSingleCheckboxDefault() {
	    return dynamicQueryCriteriaSingleCheckboxDefault;
	  }

	  public String getDynamicQueryCriteriaSingleChoiceList() {
	    return dynamicQueryCriteriaSingleChoiceList;
	  }

	  public String getDynamicQueryCriteriaSingleLineRadio() {
	    return dynamicQueryCriteriaSingleLineRadio;
	  }

	  public String getDynamicQueryCriteriaSingleLineRadio0() {
	    return dynamicQueryCriteriaSingleLineRadio0;
	  }

	  public String getDynamicQueryCriteriaSingleLineRadio1() {
	    return dynamicQueryCriteriaSingleLineRadio1;
	  }

	  public String getDynamicQueryCriteriaSingleLineRadio2() {
	    return dynamicQueryCriteriaSingleLineRadio2;
	  }

	  public Integer getDynamicQueryCriteriaSingleLineRadioDefault() {
	    return dynamicQueryCriteriaSingleLineRadioDefault;
	  }

	  public Boolean getDynamicQueryCriteriaSmallTextInput() {
	    return dynamicQueryCriteriaSmallTextInput;
	  }

	  public Boolean getDynamicQueryCriteriaSort() {
	    return dynamicQueryCriteriaSort;
	  }

	  public String getDynamicQueryCriteriaSubHeading() {
	    return dynamicQueryCriteriaSubHeading;
	  }

	 // Setter Methods 

	  public void setDynamicQueryCriteriaAllAnyType( String dynamicQueryCriteriaAllAnyType ) {
	    this.dynamicQueryCriteriaAllAnyType = dynamicQueryCriteriaAllAnyType;
	  }

	  public void setDynamicQueryCriteriaAllowNoChoice( Boolean dynamicQueryCriteriaAllowNoChoice ) {
	    this.dynamicQueryCriteriaAllowNoChoice = dynamicQueryCriteriaAllowNoChoice;
	  }

	  public void setDynamicQueryCriteriaAndOrDefault( String dynamicQueryCriteriaAndOrDefault ) {
	    this.dynamicQueryCriteriaAndOrDefault = dynamicQueryCriteriaAndOrDefault;
	  }

	  public void setDynamicQueryCriteriaAndOrType( String dynamicQueryCriteriaAndOrType ) {
	    this.dynamicQueryCriteriaAndOrType = dynamicQueryCriteriaAndOrType;
	  }

	  public void setDynamicQueryCriteriaApplyButton( Boolean dynamicQueryCriteriaApplyButton ) {
	    this.dynamicQueryCriteriaApplyButton = dynamicQueryCriteriaApplyButton;
	  }

	  public void setDynamicQueryCriteriaApplyCheckbox( Boolean dynamicQueryCriteriaApplyCheckbox ) {
	    this.dynamicQueryCriteriaApplyCheckbox = dynamicQueryCriteriaApplyCheckbox;
	  }

	  public void setDynamicQueryCriteriaApplyText( String dynamicQueryCriteriaApplyText ) {
	    this.dynamicQueryCriteriaApplyText = dynamicQueryCriteriaApplyText;
	  }

	  public void setDynamicQueryCriteriaCalendar( Boolean dynamicQueryCriteriaCalendar ) {
	    this.dynamicQueryCriteriaCalendar = dynamicQueryCriteriaCalendar;
	  }

	  public void setDynamicQueryCriteriaCalendarPlaceHolder0( String dynamicQueryCriteriaCalendarPlaceHolder0 ) {
	    this.dynamicQueryCriteriaCalendarPlaceHolder0 = dynamicQueryCriteriaCalendarPlaceHolder0;
	  }

	  public void setDynamicQueryCriteriaCalendarPlaceHolder1( String dynamicQueryCriteriaCalendarPlaceHolder1 ) {
	    this.dynamicQueryCriteriaCalendarPlaceHolder1 = dynamicQueryCriteriaCalendarPlaceHolder1;
	  }

	  public void setDynamicQueryCriteriaCalendarPrompt0( String dynamicQueryCriteriaCalendarPrompt0 ) {
	    this.dynamicQueryCriteriaCalendarPrompt0 = dynamicQueryCriteriaCalendarPrompt0;
	  }

	  public void setDynamicQueryCriteriaCalendarPrompt1( String dynamicQueryCriteriaCalendarPrompt1 ) {
	    this.dynamicQueryCriteriaCalendarPrompt1 = dynamicQueryCriteriaCalendarPrompt1;
	  }

	  public void setDynamicQueryCriteriaClearButton( Boolean dynamicQueryCriteriaClearButton ) {
	    this.dynamicQueryCriteriaClearButton = dynamicQueryCriteriaClearButton;
	  }

	  public void setDynamicQueryCriteriaHeading( String dynamicQueryCriteriaHeading ) {
	    this.dynamicQueryCriteriaHeading = dynamicQueryCriteriaHeading;
	  }

	  public void setDynamicQueryCriteriaLargeTextInput( Boolean dynamicQueryCriteriaLargeTextInput ) {
	    this.dynamicQueryCriteriaLargeTextInput = dynamicQueryCriteriaLargeTextInput;
	  }

	  public void setDynamicQueryCriteriaMultiChoiceList( Boolean dynamicQueryCriteriaMultiChoiceList ) {
	    this.dynamicQueryCriteriaMultiChoiceList = dynamicQueryCriteriaMultiChoiceList;
	  }

	  public void setDynamicQueryCriteriaNumber( Boolean dynamicQueryCriteriaNumber ) {
	    this.dynamicQueryCriteriaNumber = dynamicQueryCriteriaNumber;
	  }

	  public void setDynamicQueryCriteriaNumberDefault( Integer dynamicQueryCriteriaNumberDefault ) {
	    this.dynamicQueryCriteriaNumberDefault = dynamicQueryCriteriaNumberDefault;
	  }

	  public void setDynamicQueryCriteriaNumberLimitHigh( Integer dynamicQueryCriteriaNumberLimitHigh ) {
	    this.dynamicQueryCriteriaNumberLimitHigh = dynamicQueryCriteriaNumberLimitHigh;
	  }

	  public void setDynamicQueryCriteriaNumberLimitLow( Integer dynamicQueryCriteriaNumberLimitLow ) {
	    this.dynamicQueryCriteriaNumberLimitLow = dynamicQueryCriteriaNumberLimitLow;
	  }

	  public void setDynamicQueryCriteriaOpenCloseButton( Boolean dynamicQueryCriteriaOpenCloseButton ) {
	    this.dynamicQueryCriteriaOpenCloseButton = dynamicQueryCriteriaOpenCloseButton;
	  }

	  public void setDynamicQueryCriteriaRequired( Boolean dynamicQueryCriteriaRequired ) {
	    this.dynamicQueryCriteriaRequired = dynamicQueryCriteriaRequired;
	  }

	  public void setDynamicQueryCriteriaSearchable( Boolean dynamicQueryCriteriaSearchable ) {
	    this.dynamicQueryCriteriaSearchable = dynamicQueryCriteriaSearchable;
	  }

	  public void setDynamicQueryCriteriaSelectionInHeadingCollapsed( Boolean dynamicQueryCriteriaSelectionInHeadingCollapsed ) {
	    this.dynamicQueryCriteriaSelectionInHeadingCollapsed = dynamicQueryCriteriaSelectionInHeadingCollapsed;
	  }

	  public void setDynamicQueryCriteriaSingleCheckbox( Boolean dynamicQueryCriteriaSingleCheckbox ) {
	    this.dynamicQueryCriteriaSingleCheckbox = dynamicQueryCriteriaSingleCheckbox;
	  }

	  public void setDynamicQueryCriteriaSingleCheckboxDefault( Boolean dynamicQueryCriteriaSingleCheckboxDefault ) {
	    this.dynamicQueryCriteriaSingleCheckboxDefault = dynamicQueryCriteriaSingleCheckboxDefault;
	  }

	  public void setDynamicQueryCriteriaSingleChoiceList( String dynamicQueryCriteriaSingleChoiceList ) {
	    this.dynamicQueryCriteriaSingleChoiceList = dynamicQueryCriteriaSingleChoiceList;
	  }

	  public void setDynamicQueryCriteriaSingleLineRadio( String dynamicQueryCriteriaSingleLineRadio ) {
	    this.dynamicQueryCriteriaSingleLineRadio = dynamicQueryCriteriaSingleLineRadio;
	  }

	  public void setDynamicQueryCriteriaSingleLineRadio0( String dynamicQueryCriteriaSingleLineRadio0 ) {
	    this.dynamicQueryCriteriaSingleLineRadio0 = dynamicQueryCriteriaSingleLineRadio0;
	  }

	  public void setDynamicQueryCriteriaSingleLineRadio1( String dynamicQueryCriteriaSingleLineRadio1 ) {
	    this.dynamicQueryCriteriaSingleLineRadio1 = dynamicQueryCriteriaSingleLineRadio1;
	  }

	  public void setDynamicQueryCriteriaSingleLineRadio2( String dynamicQueryCriteriaSingleLineRadio2 ) {
	    this.dynamicQueryCriteriaSingleLineRadio2 = dynamicQueryCriteriaSingleLineRadio2;
	  }

	  public void setDynamicQueryCriteriaSingleLineRadioDefault( Integer dynamicQueryCriteriaSingleLineRadioDefault ) {
	    this.dynamicQueryCriteriaSingleLineRadioDefault = dynamicQueryCriteriaSingleLineRadioDefault;
	  }

	  public void setDynamicQueryCriteriaSmallTextInput( Boolean dynamicQueryCriteriaSmallTextInput ) {
	    this.dynamicQueryCriteriaSmallTextInput = dynamicQueryCriteriaSmallTextInput;
	  }

	  public void setDynamicQueryCriteriaSort( Boolean dynamicQueryCriteriaSort ) {
	    this.dynamicQueryCriteriaSort = dynamicQueryCriteriaSort;
	  }

	  public void setDynamicQueryCriteriaSubHeading( String dynamicQueryCriteriaSubHeading ) {
	    this.dynamicQueryCriteriaSubHeading = dynamicQueryCriteriaSubHeading;
	  }

	public List<String> getDynamicQueryCriteriaListData() {
		return dynamicQueryCriteriaListData;
	}

	public void setDynamicQueryCriteriaListData(List<String> dynamicQueryCriteriaListData) {
		this.dynamicQueryCriteriaListData = dynamicQueryCriteriaListData;
	}

	public String getDynamicQueryCriteriaAllAnyDefault() {
		return dynamicQueryCriteriaAllAnyDefault;
	}

	public void setDynamicQueryCriteriaAllAnyDefault(String dynamicQueryCriteriaAllAnyDefault) {
		this.dynamicQueryCriteriaAllAnyDefault = dynamicQueryCriteriaAllAnyDefault;
	}
	  
	  
}



