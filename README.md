Welcome to the National Biomedical Image Archive Project!
================================================================

The National Biomedical Imaging Archive (NBIA) is a free and open-source service and software application that enables users to securely store, search, and download diagnostic medical images. Using role-based security, NBIA provides web-based access to de-identified DICOM images, image markup, annotations, and rich metadata. NBIA provides web-based and programmatic access to DICOM images. NBIA consists of a search client, data administration tools, user administration tools, and the NBIA Data Retriever, which supports downloading of images to the user’s local computer.

The NBIA download package is a ZIP package that includes the NBIA application, supporting libraries, the RSNA MIRC application (with NBIA modifications), documentation, and a sample NBIA database. The system utilizes a Java server that provides REST services to independent applications such as the Angular-based graphical user interfaces. It also includes a Solr server that indexes all tags in the DICOM headers and allows rapid retrieval based on any of the information in the tags. The applications are loosely coupled, enabling independent upgrades, speeding the delivery of features to users.

Along with the Clinical Trial Processor software from the Radiological Society of North America, NBIA supports customized de-identification of images. NBIA can integrate with other applications through a set of APIs that can facilitate data query and data transfer between multiple repositories, such as between the NCI image repositories, The Cancer Imaging Archive ([TCIA](https://www.cancerimagingarchive.net/)), and [Imaging Data Commons](https://portal.imaging.datacommons.cancer.gov/), a cloud-based resource. NBIA enables several medical imaging archives, including TCIA, which currently hosts over 27.5 million images and empowers downloads of over 100 TB per month. Anyone can deploy a local node of NBIA. 

The ultimate goals of the project include:
  * Create an imaging informatics infrastructure that provides cost-effective support for purpose-built and other databases as necessary, precluding the need to create separate infrastructure for each database;
  * Develop searchable imaging reference libraries linked to clinical outcomes data to assist researchers and practitioners;
  * Supply an archive for mining and integration by the broader research and clinical community; and
  * Support data-driven decision-making.
NBIA is distributed under the BSD 3-clause license. Please see the NOTICE and LICENSE files for details.

You will find more details about NBIA in the following links:
  * [Community Wiki] (https://wiki.nci.nih.gov/x/E4b3Ag)
  * [Developer Guide] (https://wiki.nci.nih.gov/x/kIHxC)
  * [Installation Guide] (https://wiki.nci.nih.gov/x/kgKYFg)
  * [Hosted Instance of NBIA] (http://imaging.nci.nih.gov)
    
Please join us in further developing and improving NBIA. Submit any issues you may find to GitHub's issue tracker. Contact [Application Support](mailto:NCIAppSupport@mail.nih.gov) for information about open-source development and NBIA.

Build and Install
================================================================
1.	Install the required software
    * Java 1.8.x
    *	Ant 1.8.x
2.	Use git to download the project.
3.	Navigate to /software/build.
4.	Type ``ant dist``.
    *	This creates the install package in /target/dist.
5.	Follow the [installation guide](https://wiki.nci.nih.gov/x/kgKYFg).

Integrate with Eclipse
================================================================
1.	Select **File** > **Import**.
2.	Select **Existing Projects into Workspace**.
3.	Select the software directory within the working copy and click **Finish**.
4.	Define a classpath variable, NBIA_BASE, to point to the /software directory.
