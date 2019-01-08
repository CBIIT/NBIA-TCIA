package gov.nih.nci.nbia;

import javax.swing.JOptionPane;
import com.apple.eawt.AppEvent;
import com.apple.eawt.Application;
import java.io.File;
import java.util.List;
import javax.swing.SwingUtilities;
/**
 * @author Q. Pan
 *
 */
public class NBIADataRetriever extends StandaloneDMDispatcher {
	private static List<File> files;
	static{
		Application.getApplication().setOpenFileHandler((AppEvent.OpenFilesEvent ofe) -> {
		files = ofe.getFiles();
		});
    };

	public static void main(String[] args) {
		SwingUtilities.invokeLater(() -> {
			StandaloneDMDispatcher app = new StandaloneDMDispatcher();
//			Application.getApplication().setOpenFileHandler((AppEvent.OpenFilesEvent ofe) -> {
//				List<File> files = ofe.getFiles();
//				if (files != null && files.size() > 0) {
//					try {
//						app.loadManifestFile(files.get(0).getAbsolutePath());
//						app.launch();
//					} catch (Exception e) {
//						JOptionPane.showMessageDialog(null, "try to see where 1"+StandaloneDMDispatcher.launchMsg);
//						e.printStackTrace();
//					}
//				} else {
//					JOptionPane.showMessageDialog(null,
//							"It should never reach here! Mac OS is not sending the correct signal.");
//				}
//			});
			
			if (files != null && files.size() > 0) {
				try {
					app.loadManifestFile(files.get(0).getAbsolutePath());
					app.launch();
				} catch (Exception e) {
					JOptionPane.showMessageDialog(null, StandaloneDMDispatcher.launchMsg);
					e.printStackTrace();
				}
			} 
//			else {
//				JOptionPane.showMessageDialog(null,
//						"It should never reach here! Mac OS is not sending the correct signal.");
//			}
			else
			if  (args.length > 0) {
				File f = new File(args[0]);
			
				if (f.exists() && f.isFile()) {
					app.loadManifestFile(args[0]);
					app.launch();
				}
			} else {
				JOptionPane.showMessageDialog(null, StandaloneDMDispatcher.launchMsg);
			}
		});
	}
}