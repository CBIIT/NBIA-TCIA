package gov.nih.nci.nbia.executors;


import org.springframework.core.task.TaskExecutor;

public class BulkUpdateTaskExecutor {

    private TaskExecutor taskExecutor;
    private BulkUpdateTask bulkUpdateTask;

    public BulkUpdateTaskExecutor(TaskExecutor taskExecutor,
    		BulkUpdateTask bulkUpdateTask) {
         this.taskExecutor = taskExecutor;
         this.bulkUpdateTask = bulkUpdateTask;
    }

    public void fire(final BulkUpdateMessage parameter) {
         taskExecutor.execute( new Runnable() {
              public void run() {
            	  bulkUpdateTask.bulkUpdate( parameter );
              }
         });
    }

}
