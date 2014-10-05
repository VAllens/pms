<%@ page contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/views/include/taglib.jsp"%>
<html>
<head>
	<title>单元信息管理</title>
	<meta name="decorator" content="default"/>
	<%@include file="/WEB-INF/views/include/dialog.jsp" %>
	<%@include file="/WEB-INF/views/include/dhtml.jsp" %>
	<script type="text/javascript">
	
	(function($){
		$.getUrlParam = function(name)
		{
			var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
			var r = window.location.search.substr(1).match(reg);
			if (r!=null) return unescape(r[2]); return null;
		}
	})(jQuery);

       var houseId;
	   var type;
		    
		$(document).ready(function() {

		     houseId = $.getUrlParam('house.id');
		     proCompanyId = $.getUrlParam('device.fees.company.id');
		     type = $.getUrlParam('type');
		    
		    initGrid();
		    
			getPaymentDetails(houseId,type);
		    
			var url = "${ctx}/pms/payemtDetail/form?house.id="+houseId+"&device.fees.company.id="+ proCompanyId;
			$("#tabs1").attr("href",url);
			
			if(type == 1){
				$("#tabs2class").attr("class","active");
				$("#btnNewt").show();
				$("#btnSave").show();
			}else{
				$("#tabs3class").attr("class","active");
				$("#btnNewt").hide();
				$("#btnSave").hide();
			}
			
			$("#tabs2").click(function(){
			     //$("#tabs2class").attr("class","active");
			     // $("#tabs3class").attr("class","");
			     //getPaymentDetails(houseId,type);
				//var proCompanyId = document.getElementById("device.fees.company.id").value;
				location.href = "${ctx}/pms/paymentAfter/list?type=1&house.id="+houseId +"&device.fees.company.id="+ proCompanyId;
			})				
			$("#tabs3").click(function(){
			    //$("#tabs3class").attr("class","active");
			    // $("#tabs2class").attr("class","");
			    //getPaymentDetails(houseId,type);
				//var proCompanyId = document.getElementById("device.fees.company.id").value;
				location.href = "${ctx}/pms/paymentAfter/list?type=2&house.id="+houseId +"&device.fees.company.id="+ proCompanyId;
			})	
			

			$("#btnNewt").click(function(){
				openWin(0,0)	
			});	
			
			$("#btnSubmit").click(function(){
			    getPaymentDetails(houseId,type);
			    //var feeCode = $("#feeCode").val();
				//location.href = "${ctx}/pms/paymentAfter/list?type=1&house.id="+houseId +"&device.fees.company.id="+ proCompanyId +"&feeCode="+feeCode;
			});		
			
			
		});
		
		
		function deletePaymentDetail(id,payemtDetailId){
		    var statu = confirm("请确认是否删除?");
	        if(!statu){
	            return false;
	        }else{
	          var url = "${ctx}/pms/paymentAfter/delete";
	         
			  $.ajax({ type:'POST', url:url,data:{'id':id,'payemtDetailId':payemtDetailId},success:function(data){
			  	  	 getPaymentDetails(houseId,type);  
					 
			   } ,error:function(XMLHttpRequest, textStatus, errorThrown) alert("删除失败") })				       
			 
	        }
		}

		
		function openWin(id,paymentDetailId){
		
				
				var url = "${ctx}/pms/paymentAfter/form?type="+ type +"&house.id="+houseId +"&payemtDetailId="+paymentDetailId;
				
				if(id > 0) url +="&id="+id; 
				
				
				var callHandler = function (v, h, f) {
				    var frm = $.jBox.getIframe("123").contentDocument.getElementById("inputForm");
				    if (v == '1') {
				        frm.submit();alert('已保存。');
				        getPaymentDetails(houseId,type);  
				    }
				    
				    if (v == '2') {
			 		
				          deletePaymentDetail(id,paymentDetailId);				       
				    
				    }
	
				   return true;
				};
				
    
				$.jBox("iframe:"+ url, {
				    title: "收据信息",
				    width: 800,
				    height: 420,
				    id:"123",
				    buttons: { '保存': 1 ,'删除': 2 , '关闭': 0 },
				    //closed:closed,
				    submit:callHandler
				});	
		
		}
		
		
		function page(n,s){
			$("#pageNo").val(n);
			$("#pageSize").val(s);
			$("#searchForm").submit();
        	return false;
        }
        
 function initGrid(){

			mygrid = new dhtmlXGridObject('gridbox');
			mygrid.selMultiRows = true;
			mygrid.setImagePath("${ctxStatic}/dhtmlxTreeGrid/image/grid/");
			var flds = "序,收费项目,收款单号,发票号 ,收款日期,收款金额,收款方式,收款人,操作";
			mygrid.setHeader(flds);
			var columnIds = "inedx,feedName,feeCode,cerCode,price,firstNum,lastNum,cost,incone,paydates";
			mygrid.setColumnIds(columnIds);
			
		    mygrid.setInitWidthsP("2,10,10,10,15,15,10,20,8");
			mygrid.setColAlign("center,center,center,right,right,right,right,right,center");
			mygrid.setColTypes("ed,ed,ed,ed,ed,ed,ed,ed,ed,ed");
		    
		    mygrid.setMultiLine(false);
			mygrid.setEditable(false);
		    mygrid.setSkin("modern2");
		    mygrid.setColSorting("na,str,str,str,str,str,int,co,int,int,int") ;
		    mygrid.enableAlterCss("even","uneven"); 
		
			mygrid.init();	 
			mygrid.setSortImgState(true,1,"ASC"); 
			mygrid.setOnRowDblClickedHandler(RowDblClickedHandler);
			//mygrid.attachFooter('合计:, , , , , , ',['text-align:center;','text-align:right;','text-align:right;','text-align:right;','text-align:right;','text-align:right;','text-align:right;']);
			//mygrid.style.height = gridbox.offsetHeight  +"px";	
			mygrid.setSizes();	

	}		
	       
	function RowDblClickedHandler(rowId,ellIndex){
	       var paymentDetailId = this.getUserData(rowId,"paymentDetailId");
           openWin(rowId,paymentDetailId);
	}     
	function getPaymentDetails(houseId,type){
		var url = '${ctx}/pms/paymentAfter/getPaymentAfterJson';
		var feeCode = $("#feeCode").val();
		$.getJSON(url,{model:'house',houseId:houseId,type:type,feeCode:feeCode},function(data){
			mygrid.clearAll();
			mygrid.loadXMLString(data.grid);
			mygrid.setSizes();	
		});
	}        
        
	</script>
</head>
<body>

	<ul class="nav nav-tabs"><shiro:hasPermission name="pms:paymentAfter:edit"></shiro:hasPermission>
		<li><a id="tabs1" href="#">缴费明细</a></li>
		<li id="tabs2class"><a id="tabs2" href="#">预付款</a></li>
		<li id="tabs3class"><a id="tabs3" href="#">付款历史</a></li>
	</ul>	
	

	<form:form id="searchForm" modelAttribute="paymentAfter" action="${ctx}/pms/paymentAfter/" method="post" class="breadcrumb form-search">
		<input id="pageNo" name="pageNo" type="hidden" value="${page.pageNo}"/>
		<input id="pageSize" name="pageSize" type="hidden" value="${page.pageSize}"/>
		<label>收款单号 ：</label><form:input path="feeCode" htmlEscape="false" maxlength="50" class="input-small"/>
		&nbsp;<input id="btnSubmit" class="btn btn-primary" type="button" value="查询"/>
		&nbsp;<input id="btnNewt" class="btn btn-primary" type="button" value="新添"/>
	</form:form>
	
	<tags:message content="${message}"/>
	
	<div class="controls">
			<div id="gridbox" width="100%" height="30%" style="background-color:white;z-index:0"></div>
	</div>

	<div class="pagination">${page}</div>
</body>
</html>
