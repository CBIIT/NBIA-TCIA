package gov.nih.nci.nbia.util;
import java.util.*;
public class TreeNode<T>  {

	TreeData data;
    TreeNode<T> parent;
    List<TreeNode<T>> children;

    public TreeNode(TreeData data) {
        this.data = data;
        this.children = new LinkedList<TreeNode<T>>();
    }

    public TreeNode<T> addChild(TreeData data) {
    	if (this.children==null){
    		this.children=new LinkedList<TreeNode<T>>();
    	}
        TreeNode<T> childNode = new TreeNode<T>(data);
        childNode.parent = this;
        this.children.add(childNode);
        return childNode;
    }

	public TreeData getData() {
		return data;
	}

	public void setData(TreeData data) {
		this.data = data;
	}



	public List<TreeNode<T>> getChildren() {
		return children;
	}

	public void setChildren(List<TreeNode<T>> children) {
		this.children = children;
	}

    

	
	
}
