/*  Copyright   2009 - IEETA
 *
 *  This file is part of Dicoogle.
 *
 *
 *  Dicoogle is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  Dicoogle is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with Dicoogle.  If not, see <http://www.gnu.org/licenses/>.
 */
package gov.nih.nci.nbia.dicomapi;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.concurrent.Executor;
import org.apache.log4j.Logger;

import javax.xml.transform.TransformerConfigurationException;
import org.dcm4che2.data.DicomElement;
import org.dcm4che2.data.DicomObject;
import org.dcm4che2.data.Tag;
import org.dcm4che2.net.Association;
import org.dcm4che2.net.DicomServiceException;
import org.dcm4che2.net.DimseRSP;
import org.dcm4che2.net.service.CFindService;
//import pt.ua.dicoogle.DebugManager;

//import pt.ua.dicoogle.core.LogDICOM;
//import pt.ua.dicoogle.core.LogLine;


//import pt.ua.dicoogle.core.LogXML;
//import pt.ua.dicoogle.core.ServerSettings;
//import pt.ua.dicoogle.core.index.IndexEngine;
//import pt.ua.dicoogle.rGUI.server.controllers.Logs;



//import pt.ua.dicoogle.server.DicomNetwork;

/**
 *
 * @author Luís A. Bastião Silva <bastiao@ua.pt>
 */
public class CFindServiceSCP extends CFindService {
	static Logger log = Logger.getLogger(CFindServiceSCP.class);
    private ServerSettings s = ServerSettings.getInstance();
    private int rspdelay = ServerSettings.getInstance().getRspDelay();
 //   private IndexEngine core = IndexEngine.getInstance();
    private DicomNetwork service = null;

    public CFindServiceSCP(String[] multiSop, Executor e) {
        super(multiSop, e);

    }

    /*** CFIND */
    @Override
    protected synchronized DimseRSP doCFind(Association as, int pcid,
            DicomObject cmd, DicomObject keys, DicomObject rsp)
            throws DicomServiceException {

    	log.info("I am in CFIND! -- > working on it");


        DimseRSP replay = null;

        /**
         * ///  How create a new Connection? Detect new connections..
        if (MainWindow.getMw() != null) {
        MainWindow.getMw().newClientConnection(as);
        }
         */
        /**
         * Verify Permited AETs
         */
        log.info(":: Verify Permited AETs @ C-FIND Action ");
        boolean permited = false;

        if (s.getPermitAllAETitles()) {
        	log.info("All AETs Permitted for Public ");
            permited = true;
        } else {
            String permitedAETs[] = s.getCAET();

            for (int i = 0; i < permitedAETs.length; i++) {
                if (permitedAETs[i].equals(as.getCallingAET())) {
                    permited = true;
                    break;
                }
            }
        }


        if (!permited) {
        	log.info("Client association NOT permited: " + as.getCallingAET() + "!");
            //as.abort();

            //return new FindRSP(keys, rsp, null);
        } else {
        	log.info("Client association permited: " + as.getCallingAET() + "!");
        }


        if (this.rspdelay > 0) {
            try {
                this.wait(this.rspdelay);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }


        /**
         * Search information at Lucene Indexer
         * So the FindRSP will fill the DimRSP
         */

        replay = new FindRSP(keys, rsp);
        DicomElement e = keys.get(Tag.PatientName);
        String add = "";
        if (e != null) {
            add = new String(e.getBytes());
        }
        LogLine ll = new LogLine("cfind", getDateTime(), as.getCallingAET(),
                as.toString() + " -- " + add);
        LogDICOM.getInstance().addLine(ll);
        LogXML l = new LogXML();
        try {
            l.printXML();
        } catch (TransformerConfigurationException ex) {
            ex.printStackTrace();
        }
       // Logs.getInstance().addLog(ll);


        return replay;
    }

    private String getDateTime() {
        DateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
        Date date = new Date();
        return dateFormat.format(date);
    }

    /**
     * @return the service
     */
    public DicomNetwork getService() {
        return service;
    }

    /**
     * @param service the service to set
     */
    public void setService(DicomNetwork service) {
        this.service = service;
    }
}
