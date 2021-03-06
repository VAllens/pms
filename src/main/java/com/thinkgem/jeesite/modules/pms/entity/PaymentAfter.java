package com.thinkgem.jeesite.modules.pms.entity;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OrderBy;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Transient;
import javax.validation.constraints.NotNull;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;
import org.hibernate.annotations.Where;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.google.common.collect.Lists;
import com.thinkgem.jeesite.common.persistence.IdEntity;
import com.thinkgem.jeesite.common.utils.excel.annotation.ExcelField;
import com.thinkgem.jeesite.common.utils.excel.fieldtype.RoleListType;
import com.thinkgem.jeesite.modules.sys.entity.Menu;
import com.thinkgem.jeesite.modules.sys.entity.Role;
import com.thinkgem.jeesite.modules.sys.entity.User;


@Entity
@Table(name = "pms_payment_after") //已收款
@DynamicInsert @DynamicUpdate
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class PaymentAfter extends IdEntity<PaymentAfter> {
//	private String feeCode; // fee_code 收款单号
//	private String certCode; // cert_code 发票号
//	private String feedName;           // 1现付 2 预付 

//	private Date receDate; // rece_date   收款日期
//	private BigDecimal costMoney; //  cost_money 应付金额
	private BigDecimal recMoney;  // rec_money 收款金额
	private BigDecimal recMoneyBak;  // rec_money 收款金额

//	private String payType;        // pay_type 收款方式  现金 支票
//	private String type;           // 1现付 2 预付 
	private House house = new House();
//	private User user;              // collect_id 收款人
 	private Integer sort; // '排序（升序）',
 	private DeviceDetail deviceDetail;
 	private PaymentBefor paymentBefor;

	private List<DeviceDetail> deviceDetailList = Lists.newArrayList(); // 拥有角色列表
 	private List<String> deviceDetailListIds = Lists.newArrayList(); // 拥有角色列表

	@Transient
	public List<String> getDeviceDetailListIds() {
		return deviceDetailListIds;
	}

	public void setDeviceDetailListIds(List<String> deviceDetailListIds) {
		this.deviceDetailListIds = deviceDetailListIds;
	}



	public PaymentAfter() {
		super();
//		this.user = this.currentUser;
//		this.receDate = new Date();
		this.sort = 30;
	}



	public PaymentAfter(String id) {
		this();
		this.id = id;
	}
	
	


//	public Long getDeviceDetailId() {
//		return deviceDetailId;
//	}
//
//	public void setDeviceDetailId(Long deviceDetailId) {
//		this.deviceDetailId = deviceDetailId;
//	}

//	public String getFeeCode() {
//		return feeCode;
//	}
//
//	public void setFeeCode(String feeCode) {
//		this.feeCode = feeCode;
//	}
//
//	public String getCertCode() {
//		return certCode;
//	}
//
//	public void setCertCode(String certCode) {
//		this.certCode = certCode;
//	}
//	
//	public String getFeedName() {
//		return feedName;
//	}
//
//	public void setFeedName(String feedName) {
//		this.feedName = feedName;
//	}

//	@Temporal(TemporalType.DATE)
//	public Date getReceDate() {
//		return receDate;
//	}
//
//	public void setReceDate(Date receDate) {
//		this.receDate = receDate;
//	}
//
//	public BigDecimal getCostMoney() {
//		return costMoney;
//	}
//
//	public void setCostMoney(BigDecimal costMoney) {
//		this.costMoney = costMoney;
//	}

	public BigDecimal getRecMoney() {
		return recMoney;
	}

	public void setRecMoney(BigDecimal recMoney) {
		this.recMoney = recMoney;
	}

//	public String getPayType() {
//		return payType;
//	}
//
//	public void setPayType(String payType) {
//		this.payType = payType;
//	}
//
// 	public String getType() {
//		return type;
//	}
//
//	public void setType(String type) {
//		this.type = type;
//	}
//	@ManyToOne
//	@JoinColumn(name="collect_id")
//	@NotFound(action = NotFoundAction.IGNORE)
//	public User getUser() {
//		return user;
//	}
//
//	public void setUser(User user) {
//		this.user = user;
//	}
	
	@ManyToOne
	@JoinColumn(name="payment_befor_id")
	@NotFound(action = NotFoundAction.IGNORE)
 	public PaymentBefor getPaymentBefor() {
		return paymentBefor;
	}

	public void setPaymentBefor(PaymentBefor paymentBefor) {
		this.paymentBefor = paymentBefor;
	}
	
//	@ManyToOne
//	@JoinColumn(name="house_id")
	@NotFound(action = NotFoundAction.IGNORE)
	@ExcelField(title="房屋", align=1, sort=5,value="House.fullName")
	@Transient
	public House getHouse() {
		return house;
	}
	
	public void setHouse(House house) {
		this.house = house;
	}

	public Integer getSort() {
		return sort;
	}

	public void setSort(Integer sort) {
		this.sort = sort;
	}
	
	@Transient
	public BigDecimal getRecMoneyBak() {
		return recMoneyBak;
	}

	public void setRecMoneyBak(BigDecimal recMoneyBak) {
		this.recMoneyBak = recMoneyBak;
	}
	
//	@Transient
	@ManyToOne
	@JoinColumn(name="device_detail_id")
	@NotFound(action = NotFoundAction.IGNORE)
	@NotNull
	public DeviceDetail getDeviceDetail() {
		return deviceDetail;
	}

	public void setDeviceDetail(DeviceDetail deviceDetail) {
		this.deviceDetail = deviceDetail;
	}
	
	
//	@ManyToMany(fetch = FetchType.EAGER)
//	@JoinTable(name = "pms_device_detail_payment", joinColumns = { @JoinColumn(name = "payemt_id") }, inverseJoinColumns = { @JoinColumn(name = "device_detail_id") })
//	@Where(clause="del_flag='"+DEL_FLAG_NORMAL+"'")
//	@OrderBy("id") @Fetch(FetchMode.SUBSELECT)
//	@NotFound(action = NotFoundAction.IGNORE)
//	@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
//	@JsonIgnore
	@Transient
	public List<DeviceDetail> getDeviceDetailList() {
		return deviceDetailList;
	}

	public void setDeviceDetailList(List<DeviceDetail> deviceDetailList) {
		this.deviceDetailList = deviceDetailList;
	}

}
