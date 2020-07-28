/*L
 *  Copyright SAIC, Ellumen and RSNA (CTP)
 *
 *
 *  Distributed under the OSI-approved BSD 3-Clause License.
 *  See http://ncip.github.com/national-biomedical-image-archive/LICENSE.txt for details.
 */

package gov.nih.nci.nbia.ui;

import gov.nih.nci.nbia.Application;
import gov.nih.nci.nbia.download.SeriesDownloaderFactory;
import gov.nih.nci.nbia.download.AbstractSeriesDownloader;
import gov.nih.nci.nbia.download.LocalSeriesDownloader;
import gov.nih.nci.nbia.download.SeriesData;
import gov.nih.nci.nbia.util.ThreadPool;
import gov.nih.nci.nbia.util.DownloaderProperties;
import gov.nih.nci.nbia.util.StringUtil;
import gov.nih.nci.nbia.util.SeriesComparitor;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Desktop;
import java.awt.FlowLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.beans.PropertyChangeEvent;
import java.beans.PropertyChangeListener;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.net.URI;
import java.text.MessageFormat;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Observable;
import java.util.Observer;

import javax.swing.BorderFactory;
import javax.swing.BoxLayout;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JMenuBar;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTable;
import javax.swing.SwingUtilities;
import javax.swing.event.ListSelectionEvent;
import javax.swing.event.ListSelectionListener;

/**
 * @author lethai
 *
 */
public class DownloadManagerFrame extends JFrame implements Observer {

	/* Download table's data model. */
	private DownloadsTableModel tableModel;
	private String errorText = "An error has occurred. Please re-construct the data basket with un-downloaded image series.";

	/* Table showing downloads. */
	private JTable table;

	/* These are the buttons for managing the download. */
	public static JButton startButton;
	private JButton pauseButton, resumeButton;
	private JButton closeButton, deleteButton;
	public static JLabel errorLabel;
	private JButton agreementButton;

	/* Currently selected download. */
	private AbstractSeriesDownloader selectedDownload;
	private String userId = "";
	private String password;
	private Integer noOfRetry;
	/*
	 * include annotation as part of the download if the series has annotation.
	 */
	private boolean includeAnnotation = true;

	private ThreadPool pool;

	/* Flag for whether or not table selection is being cleared. */
	private boolean clearing;
	private String serverUrl = "";
	private Integer maxThreads;

	private DirectoryBrowserPanel directoryBrowserPanel;
	private RadioButtonPanel radioButtonPanel;
	private TotalProgressPanel totalProgressPanel;
	private long totalSize = 0;
	private HashMap<String, String[]>clList = new HashMap<String, String[]>();

	public DownloadManagerFrame(String userId, String password, boolean includeAnnotation, List<SeriesData> series,
			String downloadServerUrl, Integer noOfRetry) {
		this.userId = userId;
		this.includeAnnotation = includeAnnotation;
		this.noOfRetry = noOfRetry;
		this.errorText = "An error has occurred.";
		buildUI();
		this.maxThreads = Application.getNumberOfMaxThreads();
		this.serverUrl = downloadServerUrl;
		this.password = password;
		Collections.sort(series, new SeriesComparitor());

		try {
			addDownload(series);
		} catch (Exception e) {
			e.printStackTrace();
			//System.out.println("Error adding series to data table: " + e.getMessage());
		}
	}
	
	public DownloadManagerFrame(boolean standalone, String userId, String password, boolean includeAnnotation, List<SeriesData> series,
			String downloadServerUrl, Integer noOfRetry) {
		this.userId = userId;
		this.includeAnnotation = includeAnnotation;
		this.noOfRetry = noOfRetry;
		this.errorText = "An error has occurred.";
		String version = "Release " + DownloaderProperties.getAppVersion() + " Build \""
				+ DownloaderProperties.getBuildTime() + "\"";
		if (standalone) {
			buildUI(version, DownloaderProperties.getHelpDeskUrl());
		}
		else buildUI();
		

		this.maxThreads = Application.getNumberOfMaxThreads();
		this.serverUrl = downloadServerUrl;
		this.password = password;
		Collections.sort(series, new SeriesComparitor());
		//System.out.println("max threads: " + maxThreads + " serverurl " + serverUrl);
		try {
			addDownload(standalone, series);
		} catch (Exception e) {
			e.printStackTrace();
			//System.out.println("Error adding series to data table: " + e.getMessage());
		}
		totalProgressPanel.setTotalSize(totalSize);
	}	

	private void buildUI() {
		String appName = Application.getAppTitle();
		if (appName==null) {
		    setTitle("NBIA Download Manager");
		} else {
			setTitle(appName+" Download Manager");
		}
		setSize(800, 450);
		addWindowListener(new WindowAdapter() {
			public void windowClosing(WindowEvent e) {
				actionExit();
			}
		});
		

		/* Set up file menu. */
		createMenuBar();

		/* Set up browse panel. */
		directoryBrowserPanel = new DirectoryBrowserPanel();
		radioButtonPanel = new RadioButtonPanel();

		/* Set up Downloads table. */
		createTable();

		/* Set up buttons panel. */
		JPanel buttonsPanel = createButtonsPanel();

		/* Set up items for the southern part of the UI. */
		JPanel southPanel = new JPanel();
		southPanel.setLayout(new BoxLayout(southPanel, BoxLayout.Y_AXIS));
		southPanel.add(radioButtonPanel);
		southPanel.add(directoryBrowserPanel);
		southPanel.add(buttonsPanel);

		/* Add panels to the display. */
		getContentPane().setLayout(new BorderLayout());

		getContentPane().add(createDownloadsPanel(), BorderLayout.CENTER);
		getContentPane().add(southPanel, BorderLayout.SOUTH);
	}

	private void buildUI(String version, String helpDeskUrl) {
		String appName = Application.getAppTitle();
		if (appName==null) {
		    setTitle("NBIA Download Manager");
		} else {
			setTitle(appName+" Download Manager");
		}
		//setSize(800, 480);
		setSize(1280, 680);
		addWindowListener(new WindowAdapter() {
			public void windowClosing(WindowEvent e) {
				actionExit();
			}
		});
		ImageIcon icon = new ImageIcon(this.getClass().getClassLoader().getResource("TCIADownloader.png"));
		this.setIconImage(icon.getImage());

		/* Set up file menu. */
		createMenuBar(version, helpDeskUrl);

		/* Set up browse panel. */
		directoryBrowserPanel = new DirectoryBrowserPanel();
		radioButtonPanel = new RadioButtonPanel();

		/* Set up Downloads table. */
		createTable();

		/* Set up buttons panel. */
		JPanel buttonsPanel = createButtonsPanel();

		/* Set up items for the southern part of the UI. */
		JPanel southPanel = new JPanel();
		southPanel.setLayout(new BoxLayout(southPanel, BoxLayout.Y_AXIS));
		southPanel.add(radioButtonPanel);
		southPanel.add(directoryBrowserPanel);
		southPanel.add(buttonsPanel);

		totalProgressPanel = new TotalProgressPanel();
		/* Add panels to the display. */
		getContentPane().setLayout(new BorderLayout());
		getContentPane().add(totalProgressPanel, BorderLayout.NORTH);
		getContentPane().add(createDownloadsPanel(), BorderLayout.CENTER);
		getContentPane().add(southPanel, BorderLayout.SOUTH);
	}
	
	private JPanel createDownloadsPanel() {
		JPanel downloadsPanel = new JPanel();

		downloadsPanel.setBorder(BorderFactory.createTitledBorder("Downloads"));
		downloadsPanel.setLayout(new BorderLayout());
		downloadsPanel.add(new JScrollPane(table), BorderLayout.CENTER);
		return downloadsPanel;
	}

	private void createTable() {
		tableModel = new DownloadsTableModel();
		table = new DownloadsTable(tableModel);
		table.getSelectionModel().addListSelectionListener(new ListSelectionListener() {
			public void valueChanged(ListSelectionEvent e) {
				tableSelectionChanged();
			}
		});
		table.addMouseListener(new java.awt.event.MouseAdapter() {
			public void mouseClicked(java.awt.event.MouseEvent e) {
				int row = table.rowAtPoint(e.getPoint());
				int col = table.columnAtPoint(e.getPoint());
				if (col == DownloadsTableModel.SERIES_ID_COLUMN + 4) {
					JOptionPane.showMessageDialog(null, " Detail status :- "
							+ tableModel.getValueAt(row, DownloadsTableModel.SERIES_ID_COLUMN + 5).toString());
				}
			}
		});
	}

	private void createMenuBar() {
		JMenuBar menuBar = new MenuBar();
		setJMenuBar(menuBar);
	}
	
	private void createMenuBar(String version, String helpDeskUrl) {
		JMenuBar menuBar = new MenuBar(version, helpDeskUrl);
		setJMenuBar(menuBar);
	}	

	public void setDefaultDownloadDir(String dir) {
		directoryBrowserPanel.setDefaultDirectory(dir);
		startButton.setEnabled(true);
	}

	// TODO: Change the hardcoded URL to something that comes from a config file
	// or property.
	private class OpenUrlAction implements ActionListener {
		@Override
		public void actionPerformed(ActionEvent e) {
			// open(uri);
			try {
				final URI uri = new URI("https://wiki.cancerimagingarchive.net/x/c4hF");
				Desktop.getDesktop().browse(uri);
			} catch (Exception et) {
				et.printStackTrace();
			}
		}
	}

	private JPanel createButtonsPanel() {
		JPanel panel = new JPanel(new BorderLayout());
		String appName = Application.getAppTitle();
		JPanel agreementPanel = new JPanel(new FlowLayout(FlowLayout.CENTER));
		if (appName != null && appName.equalsIgnoreCase("TCIA")) {
			agreementButton = new JButton();
			agreementButton.setText(
					"<HTML><FONT color=\"#112299\">By clicking the Start button below, you agree to abide by the terms of TCIA's </FONT>"
							+ "<FONT color=\"#000099\"><U>Data Use Policy</U></FONT>"
							+ "<FONT color=\"#112299\">.</FONT>");
			agreementButton.setBorder(BorderFactory.createEmptyBorder(4, 4, 4, 4));
			agreementButton.setContentAreaFilled(false);
			agreementButton.setOpaque(false);
			agreementButton.setBackground(Color.WHITE);
			agreementButton.addActionListener(new OpenUrlAction());
			agreementButton.setEnabled(true);
			agreementButton.setVisible(true);
			agreementPanel.add(agreementButton);
			agreementPanel.setVisible(true);
		}

		JPanel buttonsPanel = new JPanel();

		startButton = new JButton("Start");
		startButton.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				actionStart();
			}
		});
		startButton.setEnabled(false);
		buttonsPanel.add(startButton);
		pauseButton = new JButton("Pause");
		pauseButton.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				actionPause();
			}
		});
		pauseButton.setEnabled(false);
		buttonsPanel.add(pauseButton);
		resumeButton = new JButton("Resume");
		resumeButton.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				actionResume();
			}
		});
		resumeButton.setEnabled(false);
		buttonsPanel.add(resumeButton);

		deleteButton = new JButton("Delete");
		deleteButton.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				actionClear();
			}
		});
		deleteButton.setEnabled(false);
		buttonsPanel.add(deleteButton);

		closeButton = new JButton("Close");
		closeButton.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				actionExit();
			}
		});
		closeButton.setEnabled(true);
		buttonsPanel.add(closeButton);
		JPanel errorPanel = new JPanel(new FlowLayout(FlowLayout.CENTER));
		errorLabel = new JLabel();
		errorLabel.setText(errorText);
		errorLabel.setVisible(false);
		errorPanel.add(errorLabel);
		panel.add(agreementPanel, BorderLayout.NORTH);
		panel.add(buttonsPanel, BorderLayout.CENTER);
		panel.add(errorPanel, BorderLayout.SOUTH);
		return panel;
	}

	private void actionExit() {
		System.exit(0);
	}

	private void addDownload(boolean standalone, List<SeriesData> seriesData) throws Exception {
		Map<String, Long> studyIdToSeriesCntMap = new HashMap<String, Long>();

		for (int i = 0; i < seriesData.size(); i++) {
			AbstractSeriesDownloader seriesDownloader = SeriesDownloaderFactory
					.createSeriesDownloader(seriesData.get(i).isLocal());

			Long seriesCnt = studyIdToSeriesCntMap.get(seriesData.get(i).getStudyInstanceUid());
			if (seriesCnt == null) {
				seriesCnt = 0L;
			}

			String[] lInfo = {seriesData.get(i).getLicenseName(), seriesData.get(i).getLicenseUrl()};
			clList.put(seriesData.get(i).getCollection(), lInfo);

				
			
			seriesDownloader.start(serverUrl, seriesData.get(i).getCollection(), seriesData.get(i).getPatientId(),
					seriesData.get(i).getStudyInstanceUid(), seriesData.get(i).getSeriesInstanceUid(),
					this.includeAnnotation, seriesData.get(i).isHasAnnotation(), seriesData.get(i).getNumberImages(),
					this.userId, this.password, seriesData.get(i).getImagesSize(), seriesData.get(i).getAnnoSize(),

					StringUtil.displayAsSixDigitString(seriesCnt), noOfRetry, seriesData.get(i).getStudyDate(),
					seriesData.get(i).getStudyId(), seriesData.get(i).getStudyDesc(), seriesData.get(i).getSeriesNum(),
					seriesData.get(i).getSeriesDesc(), 
					seriesData.get(i).getThirdPartyAnalysis(), seriesData.get(i).getDescriptionURI(),
					seriesData.get(i).getManufacturer(), seriesData.get(i).getModality(),
					seriesData.get(i).getSopClassUID(), seriesData.get(i).getSopClassName(),
					seriesData.get(i).getLicenseName(), seriesData.get(i).getLicenseUrl());
			tableModel.addDownload(seriesDownloader);
			totalSize = seriesData.get(i).getImagesSize() + seriesData.get(i).getAnnoSize() + totalSize;
			seriesDownloader.addObserver(totalProgressPanel);

			studyIdToSeriesCntMap.put(seriesData.get(i).getStudyInstanceUid(), seriesCnt + 1);
//			System.out.println("total size="+totalSize + " image size =" + seriesData.get(i).getImagesSize() + "annotation size = "+ seriesData.get(i).getAnnoSize());
		}
	}
	
    public void createLicenseFile (String rootDir) {
    	File outputDir = null;
		if (rootDir == null) {
			outputDir = new java.io.File(".");
		} else {
			outputDir = new File(rootDir);
		}
	   for(Map.Entry m : clList.entrySet()){      
		    String collection = (String) m.getKey();
		    String [] mValue = (String[]) m.getValue();
		    String licenseName = mValue[0];
		    String licenseUrl = mValue[1];
		    
		    if (!licenseName.equals("null")) {
			    String fileName = outputDir +File.separator
						+ System.getProperty("databasketId").replace(".tcia", "")
						+ File.separator + collection + File.separator + "license.html";
		    
				File file = new File(fileName);
	
				BufferedWriter writer;
				try {
					file.getParentFile().mkdirs(); 
					if (!file.exists()) {
					    file.createNewFile();
					} 
	
					writer = new BufferedWriter(new FileWriter(file, true));
			    	String content = new MessageFormat(DownloaderProperties.getLicenseText()).format(new String[] {licenseName, licenseUrl});
			        writer.append(content);
			         
			        writer.close();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}		    
		  } 
	   }
	}	
	
	// may not need to distinguish the JNLP download and app download	
	private void addDownload(List<SeriesData> seriesData) throws Exception {
		Map<String, Long> studyIdToSeriesCntMap = new HashMap<String, Long>();

		for (int i = 0; i < seriesData.size(); i++) {
			AbstractSeriesDownloader seriesDownloader = SeriesDownloaderFactory
					.createSeriesDownloader(seriesData.get(i).isLocal());

			Long seriesCnt = studyIdToSeriesCntMap.get(seriesData.get(i).getStudyInstanceUid());
			if (seriesCnt == null) {
				seriesCnt = 0L;
			}

			seriesDownloader.start(serverUrl, seriesData.get(i).getCollection(), seriesData.get(i).getPatientId(),
					seriesData.get(i).getStudyInstanceUid(), seriesData.get(i).getSeriesInstanceUid(),
					this.includeAnnotation, seriesData.get(i).isHasAnnotation(), seriesData.get(i).getNumberImages(),
					this.userId, this.password, seriesData.get(i).getImagesSize(), seriesData.get(i).getAnnoSize(),

					StringUtil.displayAsSixDigitString(seriesCnt), noOfRetry, seriesData.get(i).getStudyDate(),
					seriesData.get(i).getStudyId(), seriesData.get(i).getStudyDesc(), seriesData.get(i).getSeriesNum(),
					seriesData.get(i).getSeriesDesc());
			tableModel.addDownload(seriesDownloader);

			studyIdToSeriesCntMap.put(seriesData.get(i).getStudyInstanceUid(), seriesCnt + 1);
		}
	}	

	/**
	 * Grab the file location from the application for where to put downloaded
	 * files and make sure each downloader is set to put files there.
	 */
	private void setSeriesDownloadersOutputDirectory(String fileLocation, boolean dirType) {
		File outputDir = null;
		if (fileLocation == null) {
			outputDir = new java.io.File(".");
		} else {
			outputDir = new File(fileLocation);
		}

		for (int i = 0; i < tableModel.getRowCount(); i++) {
			AbstractSeriesDownloader downloader = tableModel.getDownload(i);
			downloader.setOutputDirectory(outputDir);
			downloader.setDirType(dirType);
		}
	}

	/* Called when table row selection changes. */
	private void tableSelectionChanged() {
		/*
		 * Unregister from receiving notifications from the last selected
		 * download.
		 */
		if (selectedDownload != null) {
			selectedDownload.deleteObserver(DownloadManagerFrame.this);
		}
		/*
		 * If not in the middle of clearing a download, set the selected
		 * download and register to receive notifications from it.
		 */
		if (!clearing && table.getSelectedRow() > -1) {
			selectedDownload = tableModel.getDownload(table.getSelectedRow());
			selectedDownload.addObserver(DownloadManagerFrame.this);
			updateButtons();
		}
	}

	/* start the download. */
	private void actionStart() {
		startButton.setEnabled(false);
		String path = this.directoryBrowserPanel.getDirectory();
		if (!(this.directoryBrowserPanel.isDirWritable(path)))
			return;
		setSeriesDownloadersOutputDirectory(this.directoryBrowserPanel.getDirectory(),
				this.radioButtonPanel.isClassicDir());

		SwingUtilities.invokeLater(new Runnable() {
			public void run() {
				pool = new ThreadPool(maxThreads);
				int size = tableModel.getRowCount();
				for (int i = 0; i < size; i++) {
					pool.assign(tableModel.getDownload(i));
					tableModel.getDownload(i).addPropertyChangeListener(propertyChangeListener);
				}
				pool.addThreadPoolListener(new ButtonUpdater(pauseButton, resumeButton, errorLabel, table)); // lrt
																										// -
																										// changed
																										// to
																										// add
																										// errorLabel
																										// as
																										// a
																										// param
			}
		});
		pauseButton.setEnabled(true);
		if (this.serverUrl.endsWith("V4"))
			createLicenseFile(this.directoryBrowserPanel.getDirectory());
		totalProgressPanel.actionStarted();
	}

	/* Pause the entire download. */
	private void actionPause() {
		int size = tableModel.getRowCount();
		for (int i = 0; i < size; i++) {
			AbstractSeriesDownloader sd = tableModel.getDownload(i);
			if (sd.getStatus() == AbstractSeriesDownloader.DOWNLOADING) {
				sd.pause();
			}
		}
		pool.pause();
		pauseButton.setEnabled(false);
		resumeButton.setEnabled(!pauseButton.isEnabled());
		//System.out.println("Resume button enabled: " + resumeButton.isEnabled());
		// updateButtons();
	}

	/* Resume the entire download. */
	private void actionResume() {		
		int size = tableModel.getRowCount();
		for (int i = 0; i < size; i++) {
			LocalSeriesDownloader sd = (LocalSeriesDownloader) ((DownloadsTableModel) table.getModel())
					.getDownload(i);
			if (sd.getStatus() == AbstractSeriesDownloader.PAUSED
					|| sd.getStatus() == AbstractSeriesDownloader.NOT_STARTED) {
				pool.assign(tableModel.getDownload(i));
			}

			if (sd.getStatus() == AbstractSeriesDownloader.PAUSED) {
				sd.resetForResume();
				sd.resume();
			}
		}
		
		resumeButton.setEnabled(false);
		pauseButton.setEnabled(!resumeButton.isEnabled());
		//System.out.println("Pause button enabled: " + pauseButton.isEnabled());
		// updateButtons();
	}

	/* Clear the selected download. */
	private void actionClear() {
		//need update the total size
		totalSize = totalSize - tableModel.getDownload(table.getSelectedRow()).getSize();
		totalProgressPanel.setTotalSize(totalSize);
		
		clearing = true;
		tableModel.clearDownload(table.getSelectedRow());
		clearing = false;
		selectedDownload = null;
		updateButtons();
	}

	/*
	 * Update each button's state based off of the currently selected download's
	 * status.
	 */
	private void updateButtons() {
		// this is invoked from a backgrouind thread as observer
		SwingUtilities.invokeLater(new Runnable() {
			public void run() {

				if (selectedDownload != null) {
					int status = selectedDownload.getStatus();
					switch (status) {
					case AbstractSeriesDownloader.DOWNLOADING:
						deleteButton.setEnabled(false);
						break;
					case AbstractSeriesDownloader.PAUSED:
						deleteButton.setEnabled(false);
						break;
					case AbstractSeriesDownloader.ERROR:
						deleteButton.setEnabled(true);
						break;
					default: // COMPLETE
						deleteButton.setEnabled(true);
					}
				} else {
					/* No download is selected in table. */
					deleteButton.setEnabled(false);
				}
			}
		});
	}

	/*
	 * Update is called when a Download notifies its observers of any changes.
	 */
	public void update(Observable o, Object arg) {
		/* Update buttons if the selected download has changed. */
		if (selectedDownload != null && selectedDownload.equals(o)) {
			updateButtons();
		}
	}

	private PropertyChangeListener propertyChangeListener = new PropertyChangeListener() {
		public void propertyChange(PropertyChangeEvent evt) {
			if ("status".equals(evt.getPropertyName())) {
				int status = Integer.parseInt(evt.getNewValue().toString());

				if (AbstractSeriesDownloader.ERROR == status && !errorLabel.isVisible()) {
					errorLabel.setVisible(true);
				}
			}
		}
	};
}