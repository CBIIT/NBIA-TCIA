/*L
 *  Copyright SAIC, Ellumen and RSNA (CTP)
 *
 *
 *  Distributed under the OSI-approved BSD 3-Clause License.
 *  See http://ncip.github.com/national-biomedical-image-archive/LICENSE.txt for details.
 */

package gov.nih.nci.nbia;


import java.io.InputStream;

import gov.nih.nci.nbia.util.Util;

import javax.sql.DataSource;
import org.dbunit.*;
import org.dbunit.database.*;
import org.dbunit.dataset.*;
import org.dbunit.dataset.xml.FlatXmlDataSet;
import org.junit.After;
import org.junit.Before;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.support.DependencyInjectionTestExecutionListener;
import org.dbunit.ext.oracle.Oracle10DataTypeFactory;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath:applicationContext-hibernate-testContext.xml" })
@TestExecutionListeners( { DependencyInjectionTestExecutionListener.class })

public abstract class AbstractDbUnitTestForJunit4 {

	@Before
	public void setUpDatabase() throws Exception {
		Util.loadSystemPropertiesFromPropertiesResource("ncia.properties");

        if(System.getProperty("database.type").equals("oracle")) {
            databaseTester = new OracleDataSourceDatabaseTester(dataSource);
	    }
	    else {
			databaseTester = new DataSourceDatabaseTester(dataSource);
		}
    	System.out.println("databaseTester for"+getClass()+" is "+databaseTester.hashCode());
		IDataSet dataSet = getDataSet();
		databaseTester.setDataSet(dataSet);
		databaseTester.onSetup();

	}

	@After
	public void tearDownDatabase() throws Exception {
		if (databaseTester != null) {
			databaseTester.onTearDown();
		}
	}

	public static class OracleDataSourceDatabaseTester extends DataSourceDatabaseTester {
		public OracleDataSourceDatabaseTester(DataSource dataSource ) {
			super(dataSource);
		}

		public IDatabaseConnection getConnection() throws Exception	{
			IDatabaseConnection conn = super.getConnection();
	     	conn.getConfig().setProperty("http://www.dbunit.org/properties/datatypeFactory", new Oracle10DataTypeFactory());
	     	return conn;

		}
	}

	/////////////////////////////////////PROTECTED///////////////////////////

    /**
     * Return the name of the XML file that contains the data set.
     * This string should specify a file/resource on the class path
     */
    protected abstract String getDataSetResourceSpec();

    protected IDataSet getDataSet() throws Exception {
    	InputStream dataSetInputStream = this.getClass()
    	                                     .getClassLoader()
    	                                     .getResourceAsStream(getDataSetResourceSpec());
    	ReplacementDataSet rds = new ReplacementDataSet(new FlatXmlDataSet(dataSetInputStream));
    	rds.addReplacementObject("{null}", null);

    	return rds;
    }


    ///////////////////////////////PRIVATE///////////////////////////////
	private IDatabaseTester databaseTester;

	@Autowired
	private DataSource dataSource;
}