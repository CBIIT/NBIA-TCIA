package gov.nih.nci.nbia.ui;

import java.awt.BorderLayout;
import java.awt.GridLayout;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JProgressBar;
import javax.swing.SwingUtilities;
import javax.swing.UIManager;
import javax.swing.border.EmptyBorder;

public class ProgressIndicator extends JFrame {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	static final JProgressBar progressBar = new JProgressBar();
	public static void main(String[] args) {
		ProgressIndicator pi = new ProgressIndicator();
		pi.showPB(true);
  }
  
  public ProgressIndicator() {
	  progressBar.setIndeterminate(true);
	  UIManager.put("ProgressBar.repaintInterval", new Integer(250));
	  UIManager.put("ProgressBar.cycleTime", new Integer(6000));
	  JPanel contentPane = new JPanel();
	  contentPane.setBorder(new EmptyBorder(20, 20, 20, 20));
	  contentPane.setLayout(new GridLayout(2,1));
	  JLabel lable = new JLabel("Contacting download server ...");
	  contentPane.add(lable, BorderLayout.CENTER);
	  contentPane.add(progressBar, BorderLayout.SOUTH);
	  setContentPane(contentPane);
	  pack();
	  setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
	  setResizable(false);
	  setLocationRelativeTo(null);
  }
  
  public void showPB (boolean visible) {
	  setTitle("Progress");
	  setVisible(visible);
  }
  
  public static void showProgress() {
	  SwingUtilities.invokeLater(new Runnable() {
	        public void run() {	            
	        	ProgressIndicator pi = new ProgressIndicator();
	    		pi.showPB(true);
	        }
	    });
  }
  
  public void dismiss(){
	  setVisible(false);
	  dispose();
  }
}