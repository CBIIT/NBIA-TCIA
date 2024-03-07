Welcome to the National Biomedical Image Archive Project!
================================================================

The National Biomedical Imaging Archive (NBIA) is a free and open-source service and software application that enables users to securely store, search, and download diagnostic medical images. Using role-based security, NBIA provides web-based access to de-identified DICOM images, image markup, annotations, and rich metadata. NBIA provides web-based and programmatic access to DICOM images. NBIA consists of a search client, data administration tools, user administration tools, and the NBIA Data Retriever, which supports downloading of images to the user’s local computer.

The NBIA download package is a ZIP package that includes the NBIA application, supporting libraries, the RSNA MIRC application (with NBIA modifications), documentation, and a sample NBIA database. The system utilizes a Java server that provides REST services to independent applications such as the Angular-based graphical user interfaces. It also includes a Solr server that indexes all tags in the DICOM headers and allows rapid retrieval based on any of the information in the tags. The applications are loosely coupled, enabling independent upgrades, speeding the delivery of features to users.

Along with the Clinical Trial Processor software from the Radiological Society of North America, NBIA supports customized de-identification of images. NBIA can integrate with other applications through a set of APIs that can facilitate data query and data transfer between multiple repositories, such as between the NCI image repositories, The Cancer Imaging Archive ([TCIA](https://www.cancerimagingarchive.net/), and [Imaging Data Commons](https://portal.imaging.datacommons.cancer.gov/), a cloud-based resource. NBIA enables several medical imaging archives, including TCIA, which currently hosts over 27.5 million images and empowers downloads of over 100 TB per month. Anyone can deploy a local node of NBIA. 

NBIA is distributed under the BSD 3-clause license. Please see the NOTICE and LICENSE files for details.

You will find more details about NBIA in the following links:
  * [REST API Guides](https://wiki.cancerimagingarchive.net/display/Public/TCIA+Programmatic+Interface+REST+API+Guides)
    
Also, review the Docker installation and deployment [instructions](https://github.com/UAMS-DBMI/nbia_docker/blob/main/README.md).

Please join us in further developing and improving NBIA. Submit any issues you may find to GitHub's issue tracker. 

Build and Install
================================================================
1.	Install the required software.
    * Java 1.8.x
    *	Ant 1.8.x
2.	Use git to download the project.
3.	Navigate to /software/build.
4.	Create the install package in /target/dist:
   
        ant dist
  
Integrate with Eclipse
================================================================
1.	Select **File** > **Import**.
2.	Select **Existing Projects into Workspace**.
3.	Select the software directory within the working copy and click **Finish**.
4.	Define a classpath variable, NBIA_BASE, to point to the /software directory.

NBIA Docker Installation Notes
================================================================
* Last updated: January 2024
* The following notes were tested on Mac OS and should work under Win OS.
##	Prerequisites & Sources
   * Git Repos
     - NBIA-TCIA 
     - https://github.com/CBIIT/NBIA-TCIA.git (commit 9b7b1f7)
   *	NBIA-Docker
      - https://github.com/UAMS-DBMI/nbia_docker.git (commit 5864b03 )
   * Apache Ant Installed
      - Tested version 1.10.14
   *	Java 8 installed 
   *	Angular-Cli installed
     - Tested version 17
   * npm installed 
     - tested version 10
   *	Node installed
     - Tested version 18
   *	Docker engine installed
   *	Python3 installed with following packages
 	   - requests
 	   - tqdm
   *	NBIA Data Retriever installed
     - Download test data
## 2.0 Installing NBIA-Docker
All of the prerequisites from the previous section must already be on the system.
The NBIA-TCIA codebase (commit 9b7b1f7) has been upgraded to Angular v17. Compile it with Java 8.
1. From the subfolder {LOCAL_NBIA_TCIA_FOLDER}/software/build, run
   
       ant dist
   * Check out NBIA-TCIA from the Git repo to the local folder {LOCAL_NBIA_TCIA_FOLDER} .
   * This creates the install package in ../target/dist. It doesn’t change anything.
3. If the command “ant dist” in previous step completed successfully, check the folder {LOCAL_NBIA_TCIA_FOLDER}/software/target/dist, expand the sub-folder, verify that the following subfolders exist as shown in Figure 1.  
     * nbia-admin
 	   * nbia-search
 	   * nbia-uat
 	   * nbia-viewer
 	   * nbia-wars 
4. Build with angular ng.
   
![Result folders from ant build for NBIA-TCIA](https://github.com/CBIIT/NBIA-TCIA/blob/master/images/Figure1ResultFoldersFromAntBuildForNBIA-TCIA.png)

Figure 1. Result folders from ant build for NBIA-TCIA

5.	Create the NBIA Docker.
     * It was tested with the branch committed as 5864b03.
6. Check out NBIA-Docker from Git repo to local folder {LOCAL_NBIA_DOCKER_FOLDER}.
7.	Copy NBIA war files (nbia-api.war, nbia-download.war) built in step 2.1 into {LOCAL_NBIA_DOCKER_FOLDER}/webapps
8. Copy NBIA javascript apps folders (nbia-search, nbia-admin, nbia-uat, nbia-viewer) built in step 2.1 into {LOCAL_NBIA_DOCKER_FOLDER}/html
9.	Use NBIA Data Retriever to download the test data into {LOCAL_NBIA_DOCKER_FOLDER}/dicoms 
     * The git repo includes two manifest files in .tcia format could be used to download the test data.
6. In the {LOCAL_NBIA_DOCKER_FOLDER}, run  

          docker compose up
      	
   * By default, use the built-in account nbiaAdmin. More users information could be found in the ldap config file {LOCAL_NBIA_DOCKER_FOLDER}/ldap/nbia.ldif. 
   * More app configurations are defined in the properties file {LOCAL_NBIA_DOCKER_FOLDER}/lib/nbia.properties.
7.	Once the docker containers are running successfully from step 2.2.5, in the {LOCAL_NBIA_DOCKER_FOLDER}, import dicom files: 

        run python script  insert_dicoms.py dicoms/metadata.csv yourusername, eg ./insert_dicoms.py dicoms/manifest-1704471493217/metadata.csv nbiaAdmin
     * The nbia containers must be running first, since the insert_dicoms.py script attempts to log into the nbia-API of your development environment.
     * Figure 2 shows the folders snapshot from previous steps.
       
![Screenshot of NBIA docker folders](https://github.com/CBIIT/NBIA-TCIA/blob/master/images/Figure2ScreenshotofNBIADockerFolders.png)

Figure 2. Screenshot of NBIA docker folders

## 3.0 Common User Activities
If the test data files were successfully loaded into the running containers, the nbiaAdmin user should update  permissions inside the application (nbia-uat) before anything shows up in nbia-search or nbia-admin.
  * Log into nbia-search, then go to 'User Admin' and assign collections to either protection group.
  *	Log into nbia-admin, set all collections to public. 
