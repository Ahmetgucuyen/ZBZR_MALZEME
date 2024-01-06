sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	'sap/m/Token',
	"../model/formatter"
], function (Controller, JSONModel, MessageBox, MessageToast, Token, formatter) {
	"use strict";
	var FormItem = [],
		getMeinsSH = [],
		getInhmeSH = [],
		getSobslSH = [],
		getLifnrSH = [],
		getMwskzSH = [],
		getTaklvSH = [],
		getMatklSH = [],
		getBrandIdSH = [],
		getMtartSH = [],
		getEkorgSH = [],
		getVtwegSH = [],
		getExtwgSH = [],
		getNumtpSH = [],
		getKtgrmSH = [],
		getKschlSH = [],
		getTempbSH = [],
		getClassSH = [],
		getSkopfSH = [],
		getFaxNumberSH = [],
		VlfkzBilgileri = [],
		PratBilgileri = [],
		MahsulBilgileri = [],
		AttypBilgileri = [],
		EXTWGBilgileri = [],
		taleOnay = [];
	var oView, Yetki, userData = {},
		Sirket,
		TableIndex;
	var CreateTemp = [];
	return Controller.extend("app.ZBZR_MALZEME.controller.MalzemeAc", {
		formatter: formatter,

		onInit: function () {
			var oViewModel;
			oViewModel = new JSONModel({});
			this.getView().setModel(oViewModel, "FormModel");
			this.getView().setModel(oViewModel, "InputModel");
			this.getView().getModel("InputModel").setProperty("/InputModelTab", false);
			this.getView().getModel("InputModel").setProperty("/InputModelTab1", false);
			this.getView().getModel("InputModel").setProperty("/InputModelTab2", false);
			this.getView().getModel("InputModel").setProperty("/InputModelRevize", false);
			/**/
			userData.Username = sap.ushell.Container.getService("UserInfo").getId();
			/*SIL*/
			//	userData.Username = "ABAPDEV";
			/*SIL*/
			this.GetRole();
			this._onRouteMatched();
			this.Select();
		},
		_onRouteMatched: function () {
			FormItem = [];
			var obj = {
				Matnr: "",
				Requestid: "",
				Matnr: "",
				Maktx: "",
				Meins: "",
				Peinh: "1000",
				Waers: "AZN",
				Netpr: "0",
				Indirim: "0",
				Indirim2: "0",
				Perakende: "0",
				Toptan: "0",
				//	Vlfkz: "",
				FaxNumber: "",
				Sobsl: "",
				Prat1: "",
				Prat2: "",
				Prat3: "",
				Prat4: "",
				Prat5: "",
				Prat6: "",
				Prat7: "",
				Prat8: "",
				Prat9: "",
				Lifnr: "",
				Name1: "",
				MaktxAz: "",
				MahsulStatu: "Açıq (Tərəzi) Məhsul",
				Ean11: "",
				Mwskz: "",
				Taklv: "",
				KutuMiktar: "0",
				Bstrf: "0",
				Inhal: "0",
				Inhme: "",
				Matkl: "",
				Wgbez: "",
				ZPergroup: "",
				ZPergroup1: "",
				BrandId: "",
				BrandDescr: "",
				Bismt: "",
				UrunUzunluk: "0",
				UrunYukseklik: "0",
				UrunGenislik: "0",
				Mhdrz: "0",
				FreeChar: "",
				KutuUzunluk: "0",
				KutuYukseklik: "0",
				KutuGenislik: "0",
				PaletMiktar: "0",
				Brgew: "0",
				Mtart: "",
				Attyp: "",
				Ekorg: "",
				Vtweg: "",
				Eantp: "",
				Extwg: "",
				Tempb: "",
				Normt: "",
				Ktgrm: "",
				Maktm: "",
				RecUser: userData.Username,
				Statu: "",
				RecDate: new Date(),
				Aciklama: "",
				Onay: "",
				Onaylayan: "",
				Bukrs: "",
				ListBedel: "",
				Ziadet: "",
				Ziaded: "",
				Kschl: "",
				Modul: "",
				Ikame: "",
				Magaza: "0",
				Depo: "0",
				Labst: "0",
				Mstae: "",
				ZdagitimBit: "",
				ZdagitimBas: "",
				Zdagitim: "",
				Neden: ""

			};
			FormItem.push(obj);
			this.getView().getModel("FormModel").setProperty("/RequestItems", FormItem);
			this.getView().getModel("InputModel").setProperty("/InputModelEdit", true);
			this.getView().getModel("InputModel").setProperty("/InputModelEdit1", false);
			this.getView().getModel("InputModel").setProperty("/InputModelButtonYarat", true);
			this.getView().getModel("InputModel").setProperty("/InputModelButtonYaratRev", false);
			this.getView().getModel("InputModel").setProperty("/InputModelButtonOnay", false);
			this.getView().getModel("InputModel").setProperty("/InputModelButtonOnayKA", false);
			this.getView().byId("MatnrIkame").setValue("");
			this.getView().byId("MagS").setValue("0");
			this.getView().byId("DepS").setValue("0");
			this.getView().byId("TopS").setValue("0");
			this.getView().byId("Gblok").setValue("");
			this.byId("Modul").destroyTokens();
			//	this.getDomain("VLFKZ");
			this.getDomain("PRATA");
			this.getDomain("ATTYP");
		},
		onCreateIptal: function (oEvent) {
			var that = this;
			MessageBox.confirm("Talebi iptal etmek istiyor musunuz?", {
				title: "Onayla",
				initialFocus: MessageBox.Action.OK,
				onClose: function (sButton) {
					if (sButton === MessageBox.Action.OK) {
						that._onRouteMatched();
						that.Select();
					}
					if (sButton === MessageBox.Action.CANCEL) {
						sap.ui.core.BusyIndicator.hide();
					}
				}
			});
		},
		onCreateTalep: function (oEvent) {
			var that = this;
			var ctrl = 0;
			var ModelForm = this.getView().getModel("FormModel").getData().RequestItems;

			if (ModelForm[0].Maktx === "") {
				MessageBox.warning("Malzeme Tanımı alanını doldurunuz.");
				return;
				ctrl = 1;
			}
			if (ModelForm[0].Netpr === "0") {
				ctrl = 1;
				MessageBox.warning("Alış Fiyatı alanını doldurunuz.");
				return;
			}
			if (ModelForm[0].Netpr === "") {
				ctrl = 1;
				MessageBox.warning("Alış Fiyatı alanını doldurunuz.");
				return;
			}
			if (ModelForm[0].Meins === "") {
				ctrl = 1;
				MessageBox.warning("Birim alanını doldurunuz.");
				return;
			}
			if (ModelForm[0].Perakende === "0") {
				ctrl = 1;
				MessageBox.warning("Perakende alanını doldurunuz.");
				return;
			}
			if (ModelForm[0].Lifnr === "") {
				ctrl = 1;
				MessageBox.warning("Satıcı Kodu alanını doldurunuz.");
				return;
			}
			if (ModelForm[0].MaktxAz === "") {
				ctrl = 1;
				MessageBox.warning("Mahsulun Adı alanını doldurunuz.");
				return;
			}
			if (ModelForm[0].UrunUzunluk === "0") {
				ctrl = 1;
				MessageBox.warning("Mahsul Uzunluk alanını doldurunuz.");
				return;
			}
			if (ModelForm[0].UrunYukseklik === "0") {
				ctrl = 1;
				MessageBox.warning("Mahsul Yukseklik alanını doldurunuz.");
				return;
			}
			if (ModelForm[0].UrunGenislik === "0") {
				ctrl = 1;
				MessageBox.warning("Mahsul Genislik alanını doldurunuz.");
				return;
			}
			if (ModelForm[0].Mwskz === "") {
				ctrl = 1;
				MessageBox.warning("Alış Vergisi alanını doldurunuz.");
				return;
			}
			if (ModelForm[0].Taklv === "") {
				ctrl = 1;
				MessageBox.warning("Satış Vergisi alanını doldurunuz.");
				return;
			}
			if (ModelForm[0].KutuMiktar === "0") {
				ctrl = 1;
				MessageBox.warning("Kutu içi Sayı alanını doldurunuz.");
				return;
			}
			if (ModelForm[0].Bstrf === "0") {
				ctrl = 1;
				MessageBox.warning("Yuvarlama Miktarı alanını doldurunuz.");
				return;
			}
			if (ModelForm[0].KutuUzunluk === "0") {
				ctrl = 1;
				MessageBox.warning("Kutu Uzunluk alanını doldurunuz.");
				return;
			}
			if (ModelForm[0].KutuYukseklik === "0") {
				ctrl = 1;
				MessageBox.warning("Kutu Yukseklik alanını doldurunuz.");
				return;
			}
			if (ModelForm[0].KutuGenislik === "0") {
				ctrl = 1;
				MessageBox.warning("Kutu Genislik alanını doldurunuz.");
				return;
			}
			if (ModelForm[0].Inhal === "0") {
				ctrl = 1;
				MessageBox.warning("Net İçerik alanını doldurunuz.");
				return;
			}
			if (ModelForm[0].KutuMiktar === "") {
				ctrl = 1;
				MessageBox.warning("Kutu içi Sayı alanını doldurunuz.");
				return;
			}
			if (ModelForm[0].Bstrf === "") {
				ctrl = 1;
				MessageBox.warning("Yuvarlama Miktarı alanını doldurunuz.");
				return;
			}
			if (ModelForm[0].KutuUzunluk === "") {
				ctrl = 1;
				MessageBox.warning("Kutu Uzunluk alanını doldurunuz.");
				return;
			}
			if (ModelForm[0].KutuYukseklik === "") {
				ctrl = 1;
				MessageBox.warning("Kutu Yukseklik alanını doldurunuz.");
				return;
			}
			if (ModelForm[0].KutuGenislik === "") {
				ctrl = 1;
				MessageBox.warning("Kutu Genislik alanını doldurunuz.");
				return;
			}
			if (ModelForm[0].Inhal === "") {
				ctrl = 1;
				MessageBox.warning("Net İçerik alanını doldurunuz.");
				return;
			}
			if (ModelForm[0].Matkl === "") {
				ctrl = 1;
				MessageBox.warning("Mal Grubu Kodu alanını doldurunuz.");
				return;
			}
			/*	if (ModelForm[0].MahsulStatu === "") {
					ctrl = 1;
					MessageBox.warning("Mahsul Statu alanını doldurunuz.");
					return;
				}*/
			if (ModelForm[0].Extwg === "") {
				ctrl = 1;
				MessageBox.warning("Harici Mal Grubu alanını doldurunuz.");
				return;
			}
			if (Sirket === "2900") {
				if (ModelForm[0].ZPergroup1 === "") {
					ctrl = 1;
					MessageBox.warning("Perfor. Ağacı Kodu alanını doldurunuz.");
					return;
				}
			} else {
				if (ModelForm[0].ZPergroup === "") {
					ctrl = 1;
					MessageBox.warning("Perfor. Ağacı Kodu alanını doldurunuz.");
					return;
				}
			}
			if (this.getView().byId("Modul").getTokens().length === 0) {
				ctrl = 1;
				MessageBox.warning("Modul alanını doldurunuz.");
				return;
			}
			if (ctrl === 0) {
				MessageBox.confirm("Talebi oluşturmak istiyor musunuz?", {
					title: "Onayla",
					initialFocus: MessageBox.Action.OK,
					onClose: function (sButton) {
						if (sButton === MessageBox.Action.OK) {
							var oDataModel = that.getOwnerComponent().getModel();
							sap.ui.core.BusyIndicator.show();

							ModelForm[0].Statu = Yetki;
							ModelForm[0].Bukrs = Sirket;
							ModelForm[0].Netpr = ModelForm[0].Netpr[0].toString();
							ModelForm[0].Indirim = ModelForm[0].Indirim[0].toString();
							ModelForm[0].Indirim2 = ModelForm[0].Indirim2[0].toString();
							ModelForm[0].Perakende = ModelForm[0].Perakende[0].toString();
							ModelForm[0].Toptan = ModelForm[0].Toptan[0].toString();
							ModelForm[0].Indirim2 = ModelForm[0].Indirim2[0].toString();
							ModelForm[0].Maktm = ModelForm[0].Maktx;
							if (ModelForm[0].ZdagitimBit === "") {
								delete ModelForm[0].ZdagitimBit;
							}
							if (ModelForm[0].ZdagitimBas === "") {
								delete ModelForm[0].ZdagitimBas;
							}
							if (that.getView().byId("Modul").getTokens().length !== 0) {
								ModelForm[0].Modul = "";
								for (var mt = 0; mt < that.getView().byId("Modul").getTokens().length; mt++) {
									if (mt === 0) {
										ModelForm[0].Modul = that.getView().byId("Modul").getTokens()[mt].mProperties.text;
									} else {
										ModelForm[0].Modul = ModelForm[0].Modul + "," + that.getView().byId("Modul").getTokens()[mt].mProperties.text;
									}
								}
							}

							delete ModelForm[0].ZPergroupAd1;
							delete ModelForm[0].ZPergroupAd;

							var requestHeader = {};

							requestHeader.NAVISDATA = ModelForm;
							requestHeader.NAVRETURN = [];
							requestHeader.Ereturnt = "a";

							oDataModel.create("/TalepAcCreateDeepSet", requestHeader, {
								success: mySuccessHandler,
								error: myErrorHandler
							});

							function mySuccessHandler(data, response) {
								var msg = "";
								if (data.NAVRETURN.results.length !== 0) {
									if (data.NAVRETURN.results.find(x => x.Type === "E") !== undefined) {
										for (var mt = 0; mt < data.NAVRETURN.results.length; mt++) {
											if (data.NAVRETURN.results[mt].Type === "E") {
												msg = data.NAVRETURN.results[mt].Message + msg;
											}
										}
										MessageBox.warning(msg);
									} else {
										for (var mt = 0; mt < data.NAVRETURN.results.length; mt++) {
											if (data.NAVRETURN.results[mt].Type === "S") {
												msg = data.NAVRETURN.results[mt].Message + msg;
											}
										}
										MessageBox.success(msg);
										that._onRouteMatched();
										that.Select();
									}
								} else {
									msg = "Talep Oluşturuldu."
									MessageBox.success(msg);
									that._onRouteMatched();
									that.Select();
								}

								sap.ui.core.BusyIndicator.hide();
							}

							function myErrorHandler(response) {
								MessageBox.error("Bir hata oluştu. Lütfen sistem yöneticinizle iletişime geçiniz.");
								sap.ui.core.BusyIndicator.hide();
							}
						}
						if (sButton === MessageBox.Action.CANCEL) {
							sap.ui.core.BusyIndicator.hide();
						}
					}
				});
			} else {
				MessageBox.warning("Zorunlu alanları doldurunuz.");
			}
		},
		onCreateOnay: function (oEvent) {
			var that = this;
			var ctrl = 0;
			var oTable = this.getView().byId("duranVarlikOnayTable");
			var aSelectedIndices = oTable.getSelectedIndices();
			var aSelectedItems = [];
			for (var i = 0; i < aSelectedIndices.length; i++) {
				var nIndex = aSelectedIndices[i];
				var oSelectedItem = oTable.getContextByIndex(nIndex).getObject();
				aSelectedItems.push(oSelectedItem);
			}
			if (aSelectedIndices.length === 0) {
				MessageBox.warning("Satır seçiniz.");
			} else {
				MessageBox.confirm("Talebi onaylamak istiyor musunuz?", {
					title: "Onayla",
					initialFocus: MessageBox.Action.OK,
					onClose: function (sButton) {
						if (sButton === MessageBox.Action.OK) {
							var oDataModel = that.getOwnerComponent().getModel();

							delete aSelectedItems[0].IStatu;
							delete aSelectedItems[0].__metadata;
							if (Yetki === "02") {
								aSelectedItems[0].Statu = "02";
								if (aSelectedItems[0].EtiketTemp !== undefined) {
									aSelectedItems[0].EtiketBilgi = aSelectedItems[0].EtiketTemp.slice(0, 1332);
									aSelectedItems[0].EtiketBilgi2 = aSelectedItems[0].EtiketTemp.slice(1333, 2665);
									aSelectedItems[0].EtiketBilgi3 = aSelectedItems[0].EtiketTemp.slice(2666, 2964);
								} else {
									aSelectedItems[0].EtiketBilgi = "";
									aSelectedItems[0].EtiketBilgi2 = "";
									aSelectedItems[0].EtiketBilgi3 = "";
								}
								delete aSelectedItems[0].EtiketTemp;
							}
							if (Yetki === "03") {
								aSelectedItems[0].Statu = "03";
								if (aSelectedItems[0].Mtart === "") {
									MessageBox.warning("Malzeme Türü alanını doldurunuz.");
									return;
								}
								if (aSelectedItems[0].AttypBilgileri === "") {
									MessageBox.warning("Malzeme Tipi alanını doldurunuz.");
									return;
								}
								if (aSelectedItems[0].Ekorg === "") {
									MessageBox.warning("Satış Organizasyonu alanını doldurunuz.");
									return;
								}
								if (aSelectedItems[0].Vtweg === "") {
									MessageBox.warning("Dağıtım Kanalı alanını doldurunuz.");
									return;
								}
								if (aSelectedItems[0].Eantp === "") {
									MessageBox.warning("Barkod Tipi alanını doldurunuz.");
									return;
								}
								if (aSelectedItems[0].Normt === "") {
									MessageBox.warning("Standart Tanım alanını doldurunuz.");
									return;
								}
								if (aSelectedItems[0].Ktgrm === "") {
									MessageBox.warning("Hesap Tayin Grubu alanını doldurunuz.");
									return;
								}
								if (aSelectedItems[0].Maktm === "") {
									MessageBox.warning("Fiş Açıklaması alanını doldurunuz.");
									return;
								}
								/*	aSelectedItems[0].EtiketBilgi = aSelectedItems[0].EtiketTemp.slice(0, 1332);
									aSelectedItems[0].EtiketBilgi2 = aSelectedItems[0].EtiketTemp.slice(1333, 2665);
									aSelectedItems[0].EtiketBilgi3 = aSelectedItems[0].EtiketTemp.slice(2666, 2964);
									delete aSelectedItems[0].EtiketTemp;*/
							}
							delete aSelectedItems[0].EtiketTemp;
							delete aSelectedItems[0].EndirimAlis;
							delete aSelectedItems[0].PerakendeMarj;
							if (aSelectedItems[0].ZdagitimBit === "") {
								delete aSelectedItems[0].ZdagitimBit;
							}
							if (aSelectedItems[0].ZdagitimBas === "") {
								delete aSelectedItems[0].ZdagitimBas;
							}
							if (aSelectedItems[0].Mhdrz === "") {
								aSelectedItems[0].Mhdrz = "0";
							}

							sap.ui.core.BusyIndicator.show();
							var requestHeader = {};

							requestHeader.NAVISDATA = aSelectedItems;
							requestHeader.NAVRETURN = [];
							requestHeader.Ereturnt = "a";

							oDataModel.create("/TalepAcCreateDeepSet", requestHeader, {
								success: mySuccessHandler,
								error: myErrorHandler
							});

							function mySuccessHandler(data, response) {
								var msg = "";
								if (data.NAVRETURN !== null) {
									if (data.NAVRETURN.results.length !== 0) {
										if (data.NAVRETURN.results.find(x => x.Type === "E") !== undefined) {
											for (var mt = 0; mt < data.NAVRETURN.results.length; mt++) {
												if (data.NAVRETURN.results[mt].Type === "E") {
													msg = data.NAVRETURN.results[mt].Message + msg;
												}
											}
											MessageBox.warning(msg);
										} else {
											for (var mt = 0; mt < data.NAVRETURN.results.length; mt++) {
												if (data.NAVRETURN.results[mt].Type === "S") {
													msg = data.NAVRETURN.results[mt].Message + msg;
												}
											}
											MessageBox.success(msg);
											that.GetOnay();
										}
									}
								} else {
									msg = "Talep Onaylanmıştır."
									MessageBox.success(msg);
									that.GetOnay();
								}

								sap.ui.core.BusyIndicator.hide();
							}

							function myErrorHandler(response) {
								MessageBox.error("Bir hata oluştu. Lütfen sistem yöneticinizle iletişime geçiniz.");
								sap.ui.core.BusyIndicator.hide();
							}
						}
						if (sButton === MessageBox.Action.CANCEL) {
							sap.ui.core.BusyIndicator.hide();
						}
					}
				});
			}
		},
		_getDialogRevize: function () {
			if (!this._oDialogRevize) {
				this._oDialogRevize = sap.ui.xmlfragment("app.ZBZR_MALZEME.fragments.RevizeNeden", this);
				this.getView().addDependent(this._oDialogRevize);
			}
			return this._oDialogRevize;
		},
		onopenRevize: function () {
			var oTable = this.getView().byId("duranVarlikOnayTable");
			var aSelectedIndices = oTable.getSelectedIndices();
			if (aSelectedIndices.length === 0) {
				MessageBox.warning("Satır seçiniz.");
				return;
			}
			this._getDialogRevize().open();
		},
		onhandleRevizeClose: function () {
			if (this._oDialogRevize) {
				this._oDialogRevize.destroy();
				delete this._oDialogRevize;
			}
		},
		onCreateRevize: function (oEvent) {
			var that = this;
			var ctrl = 0;
			var oTable = this.getView().byId("duranVarlikOnayTable");
			var aSelectedIndices = oTable.getSelectedIndices();
			var aSelectedItems = [];
			for (var i = 0; i < aSelectedIndices.length; i++) {
				var nIndex = aSelectedIndices[i];
				var oSelectedItem = oTable.getContextByIndex(nIndex).getObject();
				aSelectedItems.push(oSelectedItem);
			}
			if (aSelectedIndices.length === 0) {
				MessageBox.warning("Satır seçiniz.");
			} else {
				if (sap.ui.getCore().byId("RevAciklama").getValue() === "") {
					MessageBox.warning("Talep Revize Nedenini Giriniz.");
					return;
				}
				MessageBox.confirm("Talebi revizeye göndermek istiyor musunuz?", {
					title: "Onayla",
					initialFocus: MessageBox.Action.OK,
					onClose: function (sButton) {
						if (sButton === MessageBox.Action.OK) {
							var oDataModel = that.getOwnerComponent().getModel();
							sap.ui.core.BusyIndicator.show();
							delete aSelectedItems[0].IStatu;
							delete aSelectedItems[0].__metadata;
							delete aSelectedItems[0].EtiketTemp;

							delete aSelectedItems[0].EndirimAlis;
							delete aSelectedItems[0].PerakendeMarj;

							if (aSelectedItems[0].ZdagitimBit === "") {
								delete aSelectedItems[0].ZdagitimBit;
							}
							if (aSelectedItems[0].ZdagitimBas === "") {
								delete aSelectedItems[0].ZdagitimBas;
							}
							aSelectedItems[0].Neden = sap.ui.getCore().byId("RevAciklama").getValue();
							aSelectedItems[0].Statu = "97";

							var requestHeader = {};

							requestHeader.NAVISDATA = aSelectedItems;
							requestHeader.NAVRETURN = [];
							requestHeader.Ereturnt = "a";

							oDataModel.create("/TalepAcCreateDeepSet", requestHeader, {
								success: mySuccessHandler,
								error: myErrorHandler
							});

							function mySuccessHandler(data, response) {
								var msg = "";
								if (data.NAVRETURN !== null) {
									if (data.NAVRETURN.results.length !== 0) {
										if (data.NAVRETURN.results.find(x => x.Type === "E") !== undefined) {
											for (var mt = 0; mt < data.NAVRETURN.results.length; mt++) {
												if (data.NAVRETURN.results[mt].Type === "E") {
													msg = data.NAVRETURN.results[mt].Message + msg;
												}
											}
											MessageBox.warning(msg);
										} else {
											for (var mt = 0; mt < data.NAVRETURN.results.length; mt++) {
												if (data.NAVRETURN.results[mt].Type === "S") {
													msg = data.NAVRETURN.results[mt].Message + msg;
												}
											}
											MessageBox.success(msg);
											that.GetOnay();
											that.onhandleRevizeClose();
										}
									}
								} else {
									msg = "Talep Revizeye Gönderildi."
									MessageBox.success(msg);
									that.GetOnay();
									that.onhandleRevizeClose();
								}

								sap.ui.core.BusyIndicator.hide();
							}

							function myErrorHandler(response) {
								MessageBox.error("Bir hata oluştu. Lütfen sistem yöneticinizle iletişime geçiniz.");
								sap.ui.core.BusyIndicator.hide();
							}
						}
						if (sButton === MessageBox.Action.CANCEL) {
							sap.ui.core.BusyIndicator.hide();
						}
					}
				});
			}
		},
		onCreateRevizeTamamla: function (oEvent) {
			var that = this;
			var ctrl = 0;
			var oTable = this.getView().byId("duranVarlikOnayTableRevize");
			var aSelectedIndices = oTable.getSelectedIndices();
			var aSelectedItems = [];
			for (var i = 0; i < aSelectedIndices.length; i++) {
				var nIndex = aSelectedIndices[i];
				var oSelectedItem = oTable.getContextByIndex(nIndex).getObject();
				aSelectedItems.push(oSelectedItem);
			}
			if (aSelectedIndices.length === 0) {
				MessageBox.warning("Satır seçiniz.");
			} else {
				MessageBox.confirm("Revizeyi tamamlamak istiyor musunuz?", {
					title: "Onayla",
					initialFocus: MessageBox.Action.OK,
					onClose: function (sButton) {
						if (sButton === MessageBox.Action.OK) {
							var oDataModel = that.getOwnerComponent().getModel();
							sap.ui.core.BusyIndicator.show();
							aSelectedItems[0].Maktm = aSelectedItems[0].Maktx;
							delete aSelectedItems[0].IStatu;
							delete aSelectedItems[0].__metadata;
							delete aSelectedItems[0].EtiketTemp;

							delete aSelectedItems[0].EndirimAlis;
							delete aSelectedItems[0].PerakendeMarj;

							if (aSelectedItems[0].ZdagitimBit === "") {
								delete aSelectedItems[0].ZdagitimBit;
							}
							if (aSelectedItems[0].ZdagitimBas === "") {
								delete aSelectedItems[0].ZdagitimBas;
							}
							aSelectedItems[0].Statu = "01";

							var requestHeader = {};

							requestHeader.NAVISDATA = aSelectedItems;
							requestHeader.NAVRETURN = [];
							requestHeader.Ereturnt = "a";

							oDataModel.create("/TalepAcCreateDeepSet", requestHeader, {
								success: mySuccessHandler,
								error: myErrorHandler
							});

							function mySuccessHandler(data, response) {
								var msg = "";
								if (data.NAVRETURN !== null) {
									if (data.NAVRETURN.results.length !== 0) {
										if (data.NAVRETURN.results.find(x => x.Type === "E") !== undefined) {
											for (var mt = 0; mt < data.NAVRETURN.results.length; mt++) {
												if (data.NAVRETURN.results[mt].Type === "E") {
													msg = data.NAVRETURN.results[mt].Message + msg;
												}
											}
											MessageBox.warning(msg);
										} else {
											for (var mt = 0; mt < data.NAVRETURN.results.length; mt++) {
												if (data.NAVRETURN.results[mt].Type === "S") {
													msg = data.NAVRETURN.results[mt].Message + msg;
												}
											}
											MessageBox.success(msg);
											that.GetOnay();
										}
									}
								} else {
									msg = "Talep Onaya Gönderildi."
									MessageBox.success(msg);
									that.GetOnay();
								}

								sap.ui.core.BusyIndicator.hide();
							}

							function myErrorHandler(response) {
								MessageBox.error("Bir hata oluştu. Lütfen sistem yöneticinizle iletişime geçiniz.");
								sap.ui.core.BusyIndicator.hide();
							}
						}
						if (sButton === MessageBox.Action.CANCEL) {
							sap.ui.core.BusyIndicator.hide();
						}
					}
				});
			}
		},
		_getDialogRet: function () {
			if (!this._oDialogRet) {
				this._oDialogRet = sap.ui.xmlfragment("app.ZBZR_MALZEME.fragments.RedNeden", this);
				this.getView().addDependent(this._oDialogRet);
			}
			return this._oDialogRet;
		},
		onopenRet: function () {
			var oTable = this.getView().byId("duranVarlikOnayTable");
			var aSelectedIndices = oTable.getSelectedIndices();
			if (aSelectedIndices.length === 0) {
				MessageBox.warning("Satır seçiniz.");
				return;
			}
			this._getDialogRet().open();
		},
		onhandleTalepRetClose: function () {
			if (this._oDialogRet) {
				this._oDialogRet.destroy();
				delete this._oDialogRet;
			}
		},
		onCreateIptal: function (oEvent) {
			var that = this;
			var ctrl = 0;
			var oTable = this.getView().byId("duranVarlikOnayTable");
			var aSelectedIndices = oTable.getSelectedIndices();
			var aSelectedItems = [];
			for (var i = 0; i < aSelectedIndices.length; i++) {
				var nIndex = aSelectedIndices[i];
				var oSelectedItem = oTable.getContextByIndex(nIndex).getObject();
				aSelectedItems.push(oSelectedItem);
			}
			if (aSelectedIndices.length === 0) {
				MessageBox.warning("Satır seçiniz.");
			} else {
				if (sap.ui.getCore().byId("RAciklama").getValue() === "") {
					MessageBox.warning("Talep İptal Nedenini Giriniz.");
					return;
				}
				MessageBox.confirm("Talebi iptal etmek istiyor musunuz?", {
					title: "Onayla",
					initialFocus: MessageBox.Action.OK,
					onClose: function (sButton) {
						if (sButton === MessageBox.Action.OK) {
							var oDataModel = that.getOwnerComponent().getModel();
							sap.ui.core.BusyIndicator.show();
							delete aSelectedItems[0].IStatu;
							delete aSelectedItems[0].__metadata;
							delete aSelectedItems[0].EtiketTemp;

							delete aSelectedItems[0].EndirimAlis;
							delete aSelectedItems[0].PerakendeMarj;

							if (aSelectedItems[0].ZdagitimBit === "") {
								delete aSelectedItems[0].ZdagitimBit;
							}
							if (aSelectedItems[0].ZdagitimBas === "") {
								delete aSelectedItems[0].ZdagitimBas;
							}

							aSelectedItems[0].Neden = sap.ui.getCore().byId("RAciklama").getValue();
							aSelectedItems[0].Statu = "98";

							var requestHeader = {};

							requestHeader.NAVISDATA = aSelectedItems;
							requestHeader.NAVRETURN = [];
							requestHeader.Ereturnt = "a";

							oDataModel.create("/TalepAcCreateDeepSet", requestHeader, {
								success: mySuccessHandler,
								error: myErrorHandler
							});

							function mySuccessHandler(data, response) {
								var msg = "";
								if (data.NAVRETURN !== null) {
									if (data.NAVRETURN.results.length !== 0) {
										if (data.NAVRETURN.results.find(x => x.Type === "E") !== undefined) {
											for (var mt = 0; mt < data.NAVRETURN.results.length; mt++) {
												if (data.NAVRETURN.results[mt].Type === "E") {
													msg = data.NAVRETURN.results[mt].Message + msg;
												}
											}
											MessageBox.warning(msg);
										} else {
											for (var mt = 0; mt < data.NAVRETURN.results.length; mt++) {
												if (data.NAVRETURN.results[mt].Type === "S") {
													msg = data.NAVRETURN.results[mt].Message + msg;
												}
											}
											MessageBox.success(msg);
											that.GetOnay();
											that.onhandleTalepRetClose();
										}
									}
								} else {
									msg = "Talep İptal Edilmiştir."
									MessageBox.success(msg);
									that.GetOnay();
									that.onhandleTalepRetClose();
								}

								sap.ui.core.BusyIndicator.hide();
							}

							function myErrorHandler(response) {
								MessageBox.error("Bir hata oluştu. Lütfen sistem yöneticinizle iletişime geçiniz.");
								sap.ui.core.BusyIndicator.hide();
							}
						}
						if (sButton === MessageBox.Action.CANCEL) {
							sap.ui.core.BusyIndicator.hide();
						}
					}
				});
			}
		},
		GetRole: function () {
			var that = this;
			var oDataModel = this.getOwnerComponent().getModel();

			sap.ui.core.BusyIndicator.show();

			oDataModel.read("/GetRoleSet(IUname='" + userData.Username + "')", {
				success: mySuccessHandler,
				error: myErrorHandler
			});

			function mySuccessHandler(data, response) {
				Yetki = "01";
				Sirket = data.EReturn;
				that.getView().getModel("InputModel").setProperty("/Sirket", Sirket);
				MessageToast.show(Sirket + " " + "Şirketi için kullanıcı girişi başarılı.");
				that.VisibleTab();
				sap.ui.core.BusyIndicator.hide();
			}

			function myErrorHandler(data, response) {
				sap.m.MessageBox.error("Bir hata oluştu. Lütfen sistem yöneticiniz ile iletişime geçiniz.");
				sap.ui.core.BusyIndicator.hide();
			}
		},

		IkameGet: function () {
			var that = this;
			var oDataModel = this.getOwnerComponent().getModel();
			var Urun = this.getView().byId("MatnrIkame").getValue();
			if (Urun === "") {
				sap.m.MessageBox.warning("İkame Ürün alanını doldurunuz.");
				return;
			}

			sap.ui.core.BusyIndicator.show();

			oDataModel.read("/GetIkameUrunSet(IMatnr='" + Urun + "')", {
				success: mySuccessHandler,
				error: myErrorHandler
			});

			function mySuccessHandler(data, response) {
				that.getView().byId("MagS").setValue(data.EMagaza + " " + data.EMeins);
				that.getView().byId("DepS").setValue(data.EDepo + " " + data.EMeins);
				that.getView().byId("TopS").setValue(data.ELabst + " " + data.EMeins);
				that.getView().byId("Gblok").setValue(data.EMstae + " " + data.EMeins);
				that.getView().getModel("FormModel").getData().RequestItems[0].Magaza = data.EMagaza;
				that.getView().getModel("FormModel").getData().RequestItems[0].Depo = data.EDepo;
				that.getView().getModel("FormModel").getData().RequestItems[0].Labst = data.ELabst;
				that.getView().getModel("FormModel").getData().RequestItems[0].Mstae = data.EMstae;
				that.getView().getModel("FormModel").refresh(true);
				sap.ui.core.BusyIndicator.hide();
			}

			function myErrorHandler(data, response) {
				sap.m.MessageBox.error("Bir hata oluştu. Lütfen sistem yöneticiniz ile iletişime geçiniz.");
				sap.ui.core.BusyIndicator.hide();
			}
		},
		GetOnay: function () {
			var that = this;
			var oDataModel = this.getOwnerComponent().getModel();

			sap.ui.core.BusyIndicator.show();
			var statu = "";
			if (Yetki === "01") {
				statu = "97";
			}
			if (Yetki === "02") {
				statu = "01";
			}
			if (Yetki === "03") {
				statu = "02";
			}
			if (Yetki !== "" && Yetki !== "01" && Yetki !== "02" && Yetki !== "03" && Yetki !== "99" && Yetki !== "97" && Yetki !== "98") {
				statu = Yetki;
			}
			taleOnay = [];
			var aFilters = [];
			aFilters.push(new sap.ui.model.Filter("IStatu", sap.ui.model.FilterOperator.EQ, statu));

			oDataModel.read("/GetListSet", {
				success: mySuccessHandler,
				filters: aFilters,
				error: myErrorHandler
			});

			function mySuccessHandler(data, response) {
				for (var mt = 0; mt < data.results.length; mt++) {
					data.results[mt].EtiketTemp = data.results[mt].EtiketBilgi + data.results[mt].EtiketBilgi2 + data.results[mt].EtiketBilgi3;
					if (data.results[mt].Indirim !== "") {
						if (parseInt(data.results[mt].Indirim) !== 0) {

							//	data.results[mt].EndirimAlis = (parseFloat(data.results[mt].Netpr) / parseFloat(data.results[mt].Peinh)) - (parseFloat(data.results[
							//		mt].Netpr) / parseFloat(data.results[mt].Peinh) * parseFloat(data.results[mt].Indirim));

							data.results[mt].EndirimAlis = (parseFloat(data.results[mt].Netpr) / parseFloat(data.results[mt].Peinh)) -
								(((parseFloat(data.results[mt].Netpr) / parseFloat(data.results[mt].Peinh)) * parseFloat(data.results[mt].Indirim)) / 100)

							if (data.results[mt].Indirim2 !== "") {
								data.results[mt].EndirimAlis = data.results[mt].EndirimAlis - ((data.results[mt].EndirimAlis * parseFloat(data.results[mt].Indirim2)) /
									100);
							}
							data.results[mt].PerakendeMarj = (parseFloat(data.results[mt].Perakende) - data.results[mt].EndirimAlis) /
								parseFloat(data.results[
									mt].Perakende);
						}
					}

				}
				taleOnay = data.results;
				that.bindView();
				sap.ui.core.BusyIndicator.hide();
			}

			function myErrorHandler(data, response) {
				sap.m.MessageBox.error("Bir hata oluştu. Lütfen sistem yöneticiniz ile iletişime geçiniz.");
				sap.ui.core.BusyIndicator.hide();
			}
		},
		onBeforeRebindTable: function (oEvent) {

			var IStatu = Yetki,
				binding = oEvent.getParameter("bindingParams"),
				oFilter;
			if (IStatu) {
				oFilter = new sap.ui.model.Filter("IStatu", sap.ui.model.FilterOperator.EQ, "K");
				binding.filters.push(oFilter);
			}
		},
		VisibleTab: function () {
			this.GetOnay();
			if (Yetki === "01") {
				this.getView().getModel("InputModel").setProperty("/InputModelTab", true);
				this.getView().getModel("InputModel").setProperty("/InputModelTab1", false);
				this.getView().getModel("InputModel").setProperty("/InputModelTab2", true);
				this.getView().getModel("InputModel").setProperty("/InputModelRevize", true);
				this.getView().getModel("InputModel").setProperty("/InputModelRole", true);
			} else {
				this.getView().getModel("InputModel").setProperty("/InputModelTab", false);
				this.getView().getModel("InputModel").setProperty("/InputModelTab1", true);
				this.getView().getModel("InputModel").setProperty("/InputModelTab2", false);
				this.getView().getModel("InputModel").setProperty("/InputModelRevize", false);
			}
			if (Yetki === "02") {
				this.getView().getModel("InputModel").setProperty("/InputModelQM", true);
				this.getView().getModel("InputModel").setProperty("/InputModelButtonYarat", false);
				this.getView().getModel("InputModel").setProperty("/InputModelButtonOnay", true);
				this.getView().getModel("InputModel").setProperty("/InputModelButtonOnayKA", false);
				this.getView().getModel("InputModel").setProperty("/InputModelButtonTalep", false);
				this.getView().getModel("InputModel").setProperty("/InputModelRole", true);
			} else {
				this.getView().getModel("InputModel").setProperty("/InputModelQM", false);
			}
			if (Yetki === "03") {
				this.getView().getModel("InputModel").setProperty("/InputModelAna", true);
				this.getView().getModel("InputModel").setProperty("/InputModelButtonYarat", false);
				this.getView().getModel("InputModel").setProperty("/InputModelButtonOnay", true);
				this.getView().getModel("InputModel").setProperty("/InputModelButtonOnayKA", true);
				this.getView().getModel("InputModel").setProperty("/InputModelButtonTalep", false);
				this.getView().getModel("InputModel").setProperty("/InputModelRole", true);
			} else {
				this.getView().getModel("InputModel").setProperty("/InputModelAna", false);
			}
			if (Yetki !== "" && Yetki !== "01" && Yetki !== "02" && Yetki !== "03" && Yetki !== "99" && Yetki !== "97" && Yetki !== "98") {
				this.getView().getModel("InputModel").setProperty("/InputModelQM", true);
				this.getView().getModel("InputModel").setProperty("/InputModelAna", true);
				this.getView().getModel("InputModel").setProperty("/InputModelButtonYarat", false);
				this.getView().getModel("InputModel").setProperty("/InputModelRevize", false);
				this.getView().getModel("InputModel").setProperty("/InputModelButtonOnay", true);
				this.getView().getModel("InputModel").setProperty("/InputModelButtonOnayKA", true);
				this.getView().getModel("InputModel").setProperty("/InputModelButtonTalep", false);
				this.getView().getModel("InputModel").setProperty("/InputModelRole", false);
			}
		},
		getDomain: function (ivDomain) {
			var that = this;
			var oDataModel = this.getOwnerComponent().getModel();
			var filters = [];
			filters.push(new sap.ui.model.Filter("IvDomain", sap.ui.model.FilterOperator.EQ, ivDomain));

			oDataModel.read("/GetDomainSet", {
				success: mySuccessHandler,
				error: myErrorHandler,
				filters: filters
			});

			function mySuccessHandler(data, response) {
				/*	if (ivDomain === "VLFKZ") {
						VlfkzBilgileri = [];
						VlfkzBilgileri = data.results;
					}*/
				if (ivDomain === "PRATA") {
					PratBilgileri = [];
					PratBilgileri = data.results;
				}
				if (ivDomain === "ATTYP") {
					AttypBilgileri = [];
					AttypBilgileri = data.results;
				}

				that.bindView();
				sap.ui.core.BusyIndicator.hide();
			}

			function myErrorHandler(response) {
				MessageBox.error("Bir hata oluştu. Lütfen sistem yöneticiniz ile iletişime geçiniz.");
				sap.ui.core.BusyIndicator.hide();
			}
		},
		onTabbar: function (oEvent) {
			if (oEvent.getSource().mProperties.selectedKey === "Ytalep") {
				this.getView().getModel("InputModel").setProperty("/InputModelButtonYarat", true);
				this.getView().getModel("InputModel").setProperty("/InputModelButtonOnay", false);
				this.getView().getModel("InputModel").setProperty("/InputModelButtonOnayKA", false);
				this.getView().getModel("InputModel").setProperty("/InputModelButtonTalep", false);
			} else {
				this.getView().getModel("InputModel").setProperty("/InputModelButtonYarat", false);
			}
			if (oEvent.getSource().mProperties.selectedKey === "Otalep") {
				this.getView().getModel("InputModel").setProperty("/InputModelButtonOnay", true);
				this.getView().getModel("InputModel").setProperty("/InputModelButtonOnayKA", true);
				this.getView().getModel("InputModel").setProperty("/InputModelButtonYarat", false);
				this.getView().getModel("InputModel").setProperty("/InputModelButtonTalep", false);
			} else {
				this.getView().getModel("InputModel").setProperty("/InputModelButtonOnay", false);
			}
			if (oEvent.getSource().mProperties.selectedKey === "Ttalep") {
				this.getView().getModel("InputModel").setProperty("/InputModelButtonTalep", true);
				this.getView().getModel("InputModel").setProperty("/InputModelButtonOnay", false);
				this.getView().getModel("InputModel").setProperty("/InputModelButtonOnayKA", false);
				this.getView().getModel("InputModel").setProperty("/InputModelButtonYarat", false);
			} else {
				this.getView().getModel("InputModel").setProperty("/InputModelButtonTalep", false);
			}
			if (oEvent.getSource().mProperties.selectedKey === "Rtalep") {
				this.getView().getModel("InputModel").setProperty("/InputModelButtonTalep", false);
				this.getView().getModel("InputModel").setProperty("/InputModelButtonOnay", false);
				this.getView().getModel("InputModel").setProperty("/InputModelButtonOnayKA", false);
				this.getView().getModel("InputModel").setProperty("/InputModelButtonYarat", false);
				this.getView().getModel("InputModel").setProperty("/InputModelButtonYaratRev", true);
			} else {
				this.getView().getModel("InputModel").setProperty("/InputModelButtonYaratRev", false);
			}
		},
		Select: function () {
			var PeinhBilgileri = [];
			var WaersBilgileri = [];
			MahsulBilgileri = [];
			this.getView().byId("Peinh").destroyItems();
			this.getView().byId("Waers").destroyItems();

			/*Satınalma Adet*/
			PeinhBilgileri.push({
				PeinhKey: "1",
				PeinhAd: "1"
			});
			PeinhBilgileri.push({
				PeinhKey: "1000",
				PeinhAd: "1000"
			});
			/*Para Birirmi*/
			WaersBilgileri.push({
				WaersKey: "AZN",
				WaersAd: "AZN"
			});
			WaersBilgileri.push({
				WaersKey: "USD",
				WaersAd: "USD"
			});
			/*Mahsul Statu*/
			MahsulBilgileri.push({
				MahsulBilgileriKey: "Açıq (Tərəzi) Məhsul",
				MahsulBilgileriAd: "Açıq (Tərəzi) Məhsul"
			});
			MahsulBilgileri.push({
				MahsulBilgileriKey: "Normal Məhsul",
				MahsulBilgileriAd: "Normal Məhsul"
			});
			MahsulBilgileri.push({
				MahsulBilgileriKey: "Qarışıq Məhsul",
				MahsulBilgileriAd: "Qarışıq Məhsul"
			});

			for (var e = 0; e < PeinhBilgileri.length; e++) {
				var OItem = new sap.ui.core.Item({
					key: PeinhBilgileri[e].PeinhKey,
					text: PeinhBilgileri[e].PeinhAd
				});
				this.getView().byId("Peinh").addItem(OItem);
			}
			for (var e = 0; e < PeinhBilgileri.length; e++) {
				var OItem = new sap.ui.core.Item({
					key: PeinhBilgileri[e].PeinhKey,
					text: PeinhBilgileri[e].PeinhAd
				});
				this.getView().byId("PeinhRev").addItem(OItem);
			}
			for (var e = 0; e < WaersBilgileri.length; e++) {
				var OItem = new sap.ui.core.Item({
					key: WaersBilgileri[e].WaersKey,
					text: WaersBilgileri[e].WaersAd
				});
				this.getView().byId("Waers").addItem(OItem);
			}
			for (var e = 0; e < WaersBilgileri.length; e++) {
				var OItem = new sap.ui.core.Item({
					key: WaersBilgileri[e].WaersKey,
					text: WaersBilgileri[e].WaersAd
				});
				this.getView().byId("WaersRev").addItem(OItem);
			}
			/*	for (var e = 0; e < MahsulBilgileri.length; e++) {
				var OItem = new sap.ui.core.Item({
					key: MahsulBilgileri[e].MahsulBilgileriKey,
					text: MahsulBilgileri[e].MahsulBilgileriAd
				});
				this.getView().byId("MahsulStatu").addItem(OItem);
			}*/
		},

		bindView: function () {
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData({
				getMeinsSH: getMeinsSH,
				getSobslSH: getSobslSH,
				getLifnrSH: getLifnrSH,
				getMwskzSH: getMwskzSH,
				getInhmeSH: getInhmeSH,

				PratBilgileri: PratBilgileri,
				AttypBilgileri: AttypBilgileri,
				EXTWGBilgileri: EXTWGBilgileri,
				taleOnay: taleOnay
			});

			this.getView().setModel(oModel, "oViewModel");
			this.getView().getModel("oViewModel").refresh(true);
		},

		/*Meins*/
		MeinsValueHelp: function (oEvent) {

			this._MeinsValueHelp = sap.ui.getCore().byId("MeinsValueHelp");
			if (!this._MeinsValueHelp) {
				this._MeinsValueHelp = sap.ui.xmlfragment("app.ZBZR_MALZEME.fragments.MeinsValueHelp", this);
			}

			jQuery.sap.syncStyleClass("sapUiSizeCompact", oView, this._MeinsValueHelp);
			this._MeinsValueHelp.open();

			var MeinsAraDialogModel = new sap.ui.model.json.JSONModel();
			MeinsAraDialogModel.setData({
				filterData: {
					Mseh3: ""
				},
				items: []
			});

			this._MeinsValueHelp.setModel(MeinsAraDialogModel);

		},

		handleMeinsAra: function () {

			sap.ui.core.BusyIndicator.show();
			var oModelMeinsArama = this._MeinsValueHelp.getModel();
			var oDataMeinsArama = oModelMeinsArama.getData();
			var aFilters = [];

			if (oDataMeinsArama.filterData.Mseh3) {
				aFilters.push(new sap.ui.model.Filter("Mseh3", sap.ui.model.FilterOperator.Contains, oDataMeinsArama.filterData.Mseh3));
			}

			this.getMeinsData(aFilters);

		},

		getMeinsData: function (filters) {
			var that = this;
			getMeinsSH = [];
			var oDataModel = this.getOwnerComponent().getModel();

			oDataModel.read("/ZbzrShMeinsSet", {
				success: mySuccessHandler,
				error: myErrorHandler,
				filters: filters
			});

			function mySuccessHandler(data, response) {
				getMeinsSH = data.results;
				that.bindView();
				var dialogData = that._MeinsValueHelp.getModel().getData();
				dialogData.items = getMeinsSH;
				that._MeinsValueHelp.getModel().refresh(true);

				sap.ui.core.BusyIndicator.hide();
			}

			function myErrorHandler(response) {
				MessageBox.error("Bir hata oluştu. Lütfen sistem yöneticiniz ile iletişime geçiniz.");
				sap.ui.core.BusyIndicator.hide();
			}
		},

		handleMeinsSec: function (oEvent) {

			var eklenecekMeins = oEvent.getSource().getBindingContext().getObject();
			this.getView().getModel("FormModel").getData().RequestItems[0].Meins = eklenecekMeins.Mseh3;
			this.getView().getModel("FormModel").refresh(true);
			this._MeinsValueHelp.destroy();

		},

		MeinsValueHelpClose: function () {
			this._MeinsValueHelp.destroy();
		},
		/*Inhme*/
		InhmeValueHelp: function (oEvent) {

			this._InhmeValueHelp = sap.ui.getCore().byId("InhmeValueHelp");
			if (!this._InhmeValueHelp) {
				this._InhmeValueHelp = sap.ui.xmlfragment("app.ZBZR_MALZEME.fragments.InhmeValueHelp", this);
			}

			jQuery.sap.syncStyleClass("sapUiSizeCompact", oView, this._InhmeValueHelp);
			this._InhmeValueHelp.open();

			var InhmeAraDialogModel = new sap.ui.model.json.JSONModel();
			InhmeAraDialogModel.setData({
				filterData: {
					Mseh3: ""
				},
				items: []
			});

			this._InhmeValueHelp.setModel(InhmeAraDialogModel);

		},

		handleInhmeAra: function () {

			sap.ui.core.BusyIndicator.show();
			var oModelInhmeArama = this._InhmeValueHelp.getModel();
			var oDataInhmeArama = oModelInhmeArama.getData();
			var aFilters = [];

			if (oDataInhmeArama.filterData.Mseh3) {
				aFilters.push(new sap.ui.model.Filter("Mseh3", sap.ui.model.FilterOperator.Contains, oDataInhmeArama.filterData.Mseh3));
			}

			this.getInhmeData(aFilters);

		},

		getInhmeData: function (filters) {
			var that = this;
			getInhmeSH = [];
			var oDataModel = this.getOwnerComponent().getModel();

			oDataModel.read("/ZbzrShMeinsSet", {
				success: mySuccessHandler,
				error: myErrorHandler,
				filters: filters
			});

			function mySuccessHandler(data, response) {
				getInhmeSH = data.results;
				that.bindView();
				var dialogData = that._InhmeValueHelp.getModel().getData();
				dialogData.items = getInhmeSH;
				that._InhmeValueHelp.getModel().refresh(true);

				sap.ui.core.BusyIndicator.hide();
			}

			function myErrorHandler(response) {
				MessageBox.error("Bir hata oluştu. Lütfen sistem yöneticiniz ile iletişime geçiniz.");
				sap.ui.core.BusyIndicator.hide();
			}
		},

		handleInhmeSec: function (oEvent) {

			var eklenecekInhme = oEvent.getSource().getBindingContext().getObject();
			this.getView().getModel("FormModel").getData().RequestItems[0].Inhme = eklenecekInhme.Mseh3;
			this.getView().getModel("FormModel").refresh(true);
			this._InhmeValueHelp.destroy();

		},

		InhmeValueHelpClose: function () {
			this._InhmeValueHelp.destroy();
		},
		/*Tedarik*/
		SobslValueHelp: function (oEvent) {

			this._SobslValueHelp = sap.ui.getCore().byId("SobslValueHelp");
			if (!this._SobslValueHelp) {
				this._SobslValueHelp = sap.ui.xmlfragment("app.ZBZR_MALZEME.fragments.SobslValueHelp", this);
			}

			jQuery.sap.syncStyleClass("sapUiSizeCompact", oView, this._SobslValueHelp);
			this._SobslValueHelp.open();

			var SobslAraDialogModel = new sap.ui.model.json.JSONModel();
			SobslAraDialogModel.setData({
				filterData: {
					Werks: "",
					Sobsl: ""
				},
				items: []
			});

			this._SobslValueHelp.setModel(SobslAraDialogModel);

		},

		handleSobslAra: function () {

			sap.ui.core.BusyIndicator.show();
			var oModelSobslArama = this._SobslValueHelp.getModel();
			var oDataSobslArama = oModelSobslArama.getData();
			var aFilters = [];

			if (oDataSobslArama.filterData.Werks) {
				aFilters.push(new sap.ui.model.Filter("Werks", sap.ui.model.FilterOperator.Contains, oDataSobslArama.filterData.Werks));
			}
			if (oDataSobslArama.filterData.Sobsl) {
				aFilters.push(new sap.ui.model.Filter("Sobsl", sap.ui.model.FilterOperator.Contains, oDataSobslArama.filterData.Sobsl));
			}

			this.getSobslData(aFilters);

		},

		getSobslData: function (filters) {
			var that = this;
			getSobslSH = [];
			var oDataModel = this.getOwnerComponent().getModel();

			oDataModel.read("/ZbzrShSobslSet", {
				success: mySuccessHandler,
				error: myErrorHandler,
				filters: filters
			});

			function mySuccessHandler(data, response) {
				getSobslSH = data.results;
				that.bindView();
				var dialogData = that._SobslValueHelp.getModel().getData();
				dialogData.items = getSobslSH;
				that._SobslValueHelp.getModel().refresh(true);

				sap.ui.core.BusyIndicator.hide();
			}

			function myErrorHandler(response) {
				MessageBox.error("Bir hata oluştu. Lütfen sistem yöneticiniz ile iletişime geçiniz.");
				sap.ui.core.BusyIndicator.hide();
			}
		},

		handleSobslSec: function (oEvent) {

			var eklenecekSobsl = oEvent.getSource().getBindingContext().getObject();
			this.getView().getModel("FormModel").getData().RequestItems[0].Sobsl = eklenecekSobsl.Sobsl;
			this.getView().getModel("FormModel").refresh(true);
			this._SobslValueHelp.destroy();

		},

		SobslValueHelpClose: function () {
			this._SobslValueHelp.destroy();
		},

		/*Satıcı Kodu*/
		LifnrValueHelp: function (oEvent) {

			this._LifnrValueHelp = sap.ui.getCore().byId("LifnrValueHelp");
			if (!this._LifnrValueHelp) {
				this._LifnrValueHelp = sap.ui.xmlfragment("app.ZBZR_MALZEME.fragments.LifnrValueHelp", this);
			}

			jQuery.sap.syncStyleClass("sapUiSizeCompact", oView, this._LifnrValueHelp);
			this._LifnrValueHelp.open();

			var LifnrAraDialogModel = new sap.ui.model.json.JSONModel();
			LifnrAraDialogModel.setData({
				filterData: {
					Mcod1: "",
					Lifnr: ""
				},
				items: []
			});

			this._LifnrValueHelp.setModel(LifnrAraDialogModel);

		},

		handleLifnrAra: function () {

			sap.ui.core.BusyIndicator.show();
			var oModelLifnrArama = this._LifnrValueHelp.getModel();
			var oDataLifnrArama = oModelLifnrArama.getData();
			var aFilters = [];

			if (oDataLifnrArama.filterData.Mcod1) {
				aFilters.push(new sap.ui.model.Filter("Mcod1", sap.ui.model.FilterOperator.Contains, oDataLifnrArama.filterData.Mcod1));
			}
			if (oDataLifnrArama.filterData.Lifnr) {
				aFilters.push(new sap.ui.model.Filter("Lifnr", sap.ui.model.FilterOperator.Contains, oDataLifnrArama.filterData.Lifnr));
			}

			this.getLifnrData(aFilters);

		},

		getLifnrData: function (filters) {
			var that = this;
			getLifnrSH = [];
			var oDataModel = this.getOwnerComponent().getModel();

			oDataModel.read("/ZbzrShLfa1Set", {
				success: mySuccessHandler,
				error: myErrorHandler,
				filters: filters
			});

			function mySuccessHandler(data, response) {
				getLifnrSH = data.results;
				that.bindView();
				var dialogData = that._LifnrValueHelp.getModel().getData();
				dialogData.items = getLifnrSH;
				that._LifnrValueHelp.getModel().refresh(true);

				sap.ui.core.BusyIndicator.hide();
			}

			function myErrorHandler(response) {
				MessageBox.error("Bir hata oluştu. Lütfen sistem yöneticiniz ile iletişime geçiniz.");
				sap.ui.core.BusyIndicator.hide();
			}
		},

		handleLifnrSec: function (oEvent) {

			var eklenecekLifnr = oEvent.getSource().getBindingContext().getObject();
			this.getView().getModel("FormModel").getData().RequestItems[0].Lifnr = eklenecekLifnr.Lifnr;
			this.getView().getModel("FormModel").getData().RequestItems[0].Name1 = eklenecekLifnr.Mcod1;
			this.getView().getModel("FormModel").refresh(true);
			this._LifnrValueHelp.destroy();

		},

		LifnrValueHelpClose: function () {
			this._LifnrValueHelp.destroy();
		},
		/*Alış*/
		MwskzValueHelp: function (oEvent) {

			this._MwskzValueHelp = sap.ui.getCore().byId("MwskzValueHelp");
			if (!this._MwskzValueHelp) {
				this._MwskzValueHelp = sap.ui.xmlfragment("app.ZBZR_MALZEME.fragments.MwskzValueHelp", this);
			}

			jQuery.sap.syncStyleClass("sapUiSizeCompact", oView, this._MwskzValueHelp);
			this._MwskzValueHelp.open();

			var MwskzAraDialogModel = new sap.ui.model.json.JSONModel();
			MwskzAraDialogModel.setData({
				filterData: {
					Text1: "",
					Mwskz: ""
				},
				items: []
			});

			this._MwskzValueHelp.setModel(MwskzAraDialogModel);

		},

		handleMwskzAra: function () {

			sap.ui.core.BusyIndicator.show();
			var oModelMwskzArama = this._MwskzValueHelp.getModel();
			var oDataMwskzArama = oModelMwskzArama.getData();
			var aFilters = [];

			if (oDataMwskzArama.filterData.Text1) {
				aFilters.push(new sap.ui.model.Filter("Text1", sap.ui.model.FilterOperator.Contains, oDataMwskzArama.filterData.Text1));
			}
			if (oDataMwskzArama.filterData.Mwskz) {
				aFilters.push(new sap.ui.model.Filter("Mwskz", sap.ui.model.FilterOperator.Contains, oDataMwskzArama.filterData.Mwskz));
			}

			this.getMwskzData(aFilters);

		},

		getMwskzData: function (filters) {
			var that = this;
			getMwskzSH = [];
			var oDataModel = this.getOwnerComponent().getModel();

			oDataModel.read("/ZbzrShMskwzSet", {
				success: mySuccessHandler,
				error: myErrorHandler,
				filters: filters
			});

			function mySuccessHandler(data, response) {
				getMwskzSH = data.results;
				that.bindView();
				var dialogData = that._MwskzValueHelp.getModel().getData();
				dialogData.items = getMwskzSH;
				that._MwskzValueHelp.getModel().refresh(true);

				sap.ui.core.BusyIndicator.hide();
			}

			function myErrorHandler(response) {
				MessageBox.error("Bir hata oluştu. Lütfen sistem yöneticiniz ile iletişime geçiniz.");
				sap.ui.core.BusyIndicator.hide();
			}
		},

		handleMwskzSec: function (oEvent) {

			var eklenecekMwskz = oEvent.getSource().getBindingContext().getObject();
			this.getView().getModel("FormModel").getData().RequestItems[0].Mwskz = eklenecekMwskz.Mwskz;
			this.getView().getModel("FormModel").refresh(true);
			this._MwskzValueHelp.destroy();

		},

		MwskzValueHelpClose: function () {
			this._MwskzValueHelp.destroy();
		},

		/*Satış*/
		TaklvValueHelp: function (oEvent) {

			this._TaklvValueHelp = sap.ui.getCore().byId("TaklvValueHelp");
			if (!this._TaklvValueHelp) {
				this._TaklvValueHelp = sap.ui.xmlfragment("app.ZBZR_MALZEME.fragments.TaklvValueHelp", this);
			}

			jQuery.sap.syncStyleClass("sapUiSizeCompact", oView, this._TaklvValueHelp);
			this._TaklvValueHelp.open();

			var TaklvAraDialogModel = new sap.ui.model.json.JSONModel();
			TaklvAraDialogModel.setData({
				filterData: {
					Vtext: "",
					Taxkm: ""
				},
				items: []
			});

			this._TaklvValueHelp.setModel(TaklvAraDialogModel);

		},

		handleTaklvAra: function () {

			sap.ui.core.BusyIndicator.show();
			var oModelTaklvArama = this._TaklvValueHelp.getModel();
			var oDataTaklvArama = oModelTaklvArama.getData();
			var aFilters = [];

			if (oDataTaklvArama.filterData.Vtext) {
				aFilters.push(new sap.ui.model.Filter("Vtext", sap.ui.model.FilterOperator.Contains, oDataTaklvArama.filterData.Vtext));
			}
			if (oDataTaklvArama.filterData.Taxkm) {
				aFilters.push(new sap.ui.model.Filter("Taxkm", sap.ui.model.FilterOperator.Contains, oDataTaklvArama.filterData.Taxkm));
			}

			this.getTaklvData(aFilters);

		},

		getTaklvData: function (filters) {
			var that = this;
			getTaklvSH = [];
			var oDataModel = this.getOwnerComponent().getModel();

			oDataModel.read("/ZbzrShTskmSet", {
				success: mySuccessHandler,
				error: myErrorHandler,
				filters: filters
			});

			function mySuccessHandler(data, response) {
				getTaklvSH = data.results;
				that.bindView();
				var dialogData = that._TaklvValueHelp.getModel().getData();
				dialogData.items = getTaklvSH;
				that._TaklvValueHelp.getModel().refresh(true);

				sap.ui.core.BusyIndicator.hide();
			}

			function myErrorHandler(response) {
				MessageBox.error("Bir hata oluştu. Lütfen sistem yöneticiniz ile iletişime geçiniz.");
				sap.ui.core.BusyIndicator.hide();
			}
		},

		handleTaklvSec: function (oEvent) {

			var eklenecekTaklv = oEvent.getSource().getBindingContext().getObject();
			this.getView().getModel("FormModel").getData().RequestItems[0].Taklv = eklenecekTaklv.Taxkm;
			this.getView().getModel("FormModel").refresh(true);
			this._TaklvValueHelp.destroy();

		},

		TaklvValueHelpClose: function () {
			this._TaklvValueHelp.destroy();
		},

		/*Mal Kodu*/
		MatklValueHelp: function (oEvent) {

			this._MatklValueHelp = sap.ui.getCore().byId("MatklValueHelp");
			if (!this._MatklValueHelp) {
				this._MatklValueHelp = sap.ui.xmlfragment("app.ZBZR_MALZEME.fragments.MatklValueHelp", this);
			}

			jQuery.sap.syncStyleClass("sapUiSizeCompact", oView, this._MatklValueHelp);
			this._MatklValueHelp.open();

			var MatklAraDialogModel = new sap.ui.model.json.JSONModel();
			MatklAraDialogModel.setData({
				filterData: {
					Matkl: "",
					Wgbez: ""
				},
				items: []
			});

			this._MatklValueHelp.setModel(MatklAraDialogModel);

		},

		handleMatklAra: function () {

			sap.ui.core.BusyIndicator.show();
			var oModelMatklArama = this._MatklValueHelp.getModel();
			var oDataMatklArama = oModelMatklArama.getData();
			var aFilters = [];

			if (oDataMatklArama.filterData.Matkl) {
				aFilters.push(new sap.ui.model.Filter("Matkl", sap.ui.model.FilterOperator.Contains, oDataMatklArama.filterData.Matkl));
			}
			if (oDataMatklArama.filterData.Wgbez) {
				aFilters.push(new sap.ui.model.Filter("Wgbez", sap.ui.model.FilterOperator.Contains, oDataMatklArama.filterData.Wgbez));
			}

			this.getMatklData(aFilters);

		},

		getMatklData: function (filters) {
			var that = this;
			getMatklSH = [];
			var oDataModel = this.getOwnerComponent().getModel();

			oDataModel.read("/ZbzrShT023Set", {
				success: mySuccessHandler,
				error: myErrorHandler,
				filters: filters
			});

			function mySuccessHandler(data, response) {
				getMatklSH = data.results;
				that.bindView();
				var dialogData = that._MatklValueHelp.getModel().getData();
				dialogData.items = getMatklSH;
				that._MatklValueHelp.getModel().refresh(true);

				sap.ui.core.BusyIndicator.hide();
			}

			function myErrorHandler(response) {
				MessageBox.error("Bir hata oluştu. Lütfen sistem yöneticiniz ile iletişime geçiniz.");
				sap.ui.core.BusyIndicator.hide();
			}
		},

		handleMatklSec: function (oEvent) {

			var eklenecekMatkl = oEvent.getSource().getBindingContext().getObject();
			this.getView().getModel("FormModel").getData().RequestItems[0].Matkl = eklenecekMatkl.Matkl;
			this.getView().getModel("FormModel").getData().RequestItems[0].Wgbez = eklenecekMatkl.Wgbez;
			this.getView().getModel("FormModel").refresh(true);
			this._MatklValueHelp.destroy();

		},

		MatklValueHelpClose: function () {
			this._MatklValueHelp.destroy();
		},

		/*Marka Kodu*/
		BrandIdValueHelp: function (oEvent) {

			this._BrandIdValueHelp = sap.ui.getCore().byId("BrandIdValueHelp");
			if (!this._BrandIdValueHelp) {
				this._BrandIdValueHelp = sap.ui.xmlfragment("app.ZBZR_MALZEME.fragments.BrandIdValueHelp", this);
			}

			jQuery.sap.syncStyleClass("sapUiSizeCompact", oView, this._BrandIdValueHelp);
			this._BrandIdValueHelp.open();

			var BrandIdAraDialogModel = new sap.ui.model.json.JSONModel();
			BrandIdAraDialogModel.setData({
				filterData: {
					BrandId: "",
					BrandDescr: ""
				},
				items: []
			});

			this._BrandIdValueHelp.setModel(BrandIdAraDialogModel);

		},

		handleBrandIdAra: function () {

			sap.ui.core.BusyIndicator.show();
			var oModelBrandIdArama = this._BrandIdValueHelp.getModel();
			var oDataBrandIdArama = oModelBrandIdArama.getData();
			var aFilters = [];

			if (oDataBrandIdArama.filterData.BrandId) {
				aFilters.push(new sap.ui.model.Filter("BrandId", sap.ui.model.FilterOperator.Contains, oDataBrandIdArama.filterData.BrandId));
			}
			if (oDataBrandIdArama.filterData.BrandDescr) {
				aFilters.push(new sap.ui.model.Filter("BrandDescr", sap.ui.model.FilterOperator.Contains, oDataBrandIdArama.filterData.BrandDescr));
			}

			this.getBrandIdData(aFilters);

		},

		getBrandIdData: function (filters) {
			var that = this;
			getBrandIdSH = [];
			var oDataModel = this.getOwnerComponent().getModel();

			oDataModel.read("/ZbzrShBrandidSet", {
				success: mySuccessHandler,
				error: myErrorHandler,
				filters: filters
			});

			function mySuccessHandler(data, response) {
				getBrandIdSH = data.results;
				that.bindView();
				var dialogData = that._BrandIdValueHelp.getModel().getData();
				dialogData.items = getBrandIdSH;
				that._BrandIdValueHelp.getModel().refresh(true);

				sap.ui.core.BusyIndicator.hide();
			}

			function myErrorHandler(response) {
				MessageBox.error("Bir hata oluştu. Lütfen sistem yöneticiniz ile iletişime geçiniz.");
				sap.ui.core.BusyIndicator.hide();
			}
		},

		handleBrandIdSec: function (oEvent) {

			var eklenecekBrandId = oEvent.getSource().getBindingContext().getObject();
			this.getView().getModel("FormModel").getData().RequestItems[0].BrandId = eklenecekBrandId.BrandId;
			this.getView().getModel("FormModel").getData().RequestItems[0].BrandDescr = eklenecekBrandId.BrandDescr;
			this.getView().getModel("FormModel").refresh(true);
			this._BrandIdValueHelp.destroy();

		},

		BrandIdValueHelpClose: function () {
			this._BrandIdValueHelp.destroy();
		},

		/*Mtart*/
		MtartValueHelp: function (oEvent) {
			var Index = oEvent.getSource().getParent().sId.split("row").length;
			var TalNo = oEvent.getSource().getParent().getCells()[0].mProperties.text;
			TableIndex = this.getView().getModel("oViewModel").getData().taleOnay.findIndex(x => x.Requestid === TalNo);
			this._MtartValueHelp = sap.ui.getCore().byId("MtartValueHelp");
			if (!this._MtartValueHelp) {
				this._MtartValueHelp = sap.ui.xmlfragment("app.ZBZR_MALZEME.fragments.MtartValueHelp", this);
			}

			jQuery.sap.syncStyleClass("sapUiSizeCompact", oView, this._MtartValueHelp);
			this._MtartValueHelp.open();

			var MtartAraDialogModel = new sap.ui.model.json.JSONModel();
			MtartAraDialogModel.setData({
				filterData: {
					Mtart: "",
					Mtbez: ""
				},
				items: []
			});

			this._MtartValueHelp.setModel(MtartAraDialogModel);

		},

		handleMtartAra: function () {

			sap.ui.core.BusyIndicator.show();
			var oModelMtartArama = this._MtartValueHelp.getModel();
			var oDataMtartArama = oModelMtartArama.getData();
			var aFilters = [];

			if (oDataMtartArama.filterData.Mtart) {
				aFilters.push(new sap.ui.model.Filter("Mtart", sap.ui.model.FilterOperator.Contains, oDataMtartArama.filterData.Mtart));
			}
			if (oDataMtartArama.filterData.Mtbez) {
				aFilters.push(new sap.ui.model.Filter("Mtbez", sap.ui.model.FilterOperator.Contains, oDataMtartArama.filterData.Mtbez));
			}

			this.getMtartData(aFilters);

		},

		getMtartData: function (filters) {
			var that = this;
			getMtartSH = [];
			var oDataModel = this.getOwnerComponent().getModel();

			oDataModel.read("/ZbzrShMtartSet", {
				success: mySuccessHandler,
				error: myErrorHandler,
				filters: filters
			});

			function mySuccessHandler(data, response) {
				getMtartSH = data.results;
				that.bindView();
				var dialogData = that._MtartValueHelp.getModel().getData();
				dialogData.items = getMtartSH;
				that._MtartValueHelp.getModel().refresh(true);

				sap.ui.core.BusyIndicator.hide();
			}

			function myErrorHandler(response) {
				MessageBox.error("Bir hata oluştu. Lütfen sistem yöneticiniz ile iletişime geçiniz.");
				sap.ui.core.BusyIndicator.hide();
			}
		},

		handleMtartSec: function (oEvent) {

			var eklenecekMtart = oEvent.getSource().getBindingContext().getObject();
			this.getView().getModel("oViewModel").getData().taleOnay[TableIndex].Mtart = eklenecekMtart.Mtart;
			this.getView().getModel("oViewModel").refresh(true);
			this._MtartValueHelp.destroy();

		},

		MtartValueHelpClose: function () {
			this._MtartValueHelp.destroy();
		},

		/*Ekorg*/
		EkorgValueHelp: function (oEvent) {
			var Index = oEvent.getSource().getParent().sId.split("row").length;
			var TalNo = oEvent.getSource().getParent().getCells()[0].mProperties.text;
			TableIndex = this.getView().getModel("oViewModel").getData().taleOnay.findIndex(x => x.Requestid === TalNo);
			this._EkorgValueHelp = sap.ui.getCore().byId("EkorgValueHelp");
			if (!this._EkorgValueHelp) {
				this._EkorgValueHelp = sap.ui.xmlfragment("app.ZBZR_MALZEME.fragments.EkorgValueHelp", this);
			}

			jQuery.sap.syncStyleClass("sapUiSizeCompact", oView, this._EkorgValueHelp);
			this._EkorgValueHelp.open();

			var EkorgAraDialogModel = new sap.ui.model.json.JSONModel();
			EkorgAraDialogModel.setData({
				filterData: {
					Ekorg: "",
					Ekotx: ""
				},
				items: []
			});

			this._EkorgValueHelp.setModel(EkorgAraDialogModel);

		},

		handleEkorgAra: function () {

			sap.ui.core.BusyIndicator.show();
			var oModelEkorgArama = this._EkorgValueHelp.getModel();
			var oDataEkorgArama = oModelEkorgArama.getData();
			var aFilters = [];

			if (oDataEkorgArama.filterData.Ekorg) {
				aFilters.push(new sap.ui.model.Filter("Ekorg", sap.ui.model.FilterOperator.Contains, oDataEkorgArama.filterData.Ekorg));
			}
			if (oDataEkorgArama.filterData.Ekotx) {
				aFilters.push(new sap.ui.model.Filter("Ekotx", sap.ui.model.FilterOperator.Contains, oDataEkorgArama.filterData.Ekotx));
			}

			this.getEkorgData(aFilters);

		},

		getEkorgData: function (filters) {
			var that = this;
			getEkorgSH = [];
			var oDataModel = this.getOwnerComponent().getModel();

			oDataModel.read("/ZbzrShEkorgSet", {
				success: mySuccessHandler,
				error: myErrorHandler,
				filters: filters
			});

			function mySuccessHandler(data, response) {
				getEkorgSH = data.results;
				that.bindView();
				var dialogData = that._EkorgValueHelp.getModel().getData();
				dialogData.items = getEkorgSH;
				that._EkorgValueHelp.getModel().refresh(true);

				sap.ui.core.BusyIndicator.hide();
			}

			function myErrorHandler(response) {
				MessageBox.error("Bir hata oluştu. Lütfen sistem yöneticiniz ile iletişime geçiniz.");
				sap.ui.core.BusyIndicator.hide();
			}
		},

		handleEkorgSec: function (oEvent) {

			var eklenecekEkorg = oEvent.getSource().getBindingContext().getObject();
			this.getView().getModel("oViewModel").getData().taleOnay[TableIndex].Ekorg = eklenecekEkorg.Ekorg;
			this.getView().getModel("oViewModel").refresh(true);
			this._EkorgValueHelp.destroy();

		},

		EkorgValueHelpClose: function () {
			this._EkorgValueHelp.destroy();
		},

		/*Vtweg*/
		VtwegValueHelp: function (oEvent) {
			var Index = oEvent.getSource().getParent().sId.split("row").length;
			var TalNo = oEvent.getSource().getParent().getCells()[0].mProperties.text;
			TableIndex = this.getView().getModel("oViewModel").getData().taleOnay.findIndex(x => x.Requestid === TalNo);
			this._VtwegValueHelp = sap.ui.getCore().byId("VtwegValueHelp");
			if (!this._VtwegValueHelp) {
				this._VtwegValueHelp = sap.ui.xmlfragment("app.ZBZR_MALZEME.fragments.VtwegValueHelp", this);
			}

			jQuery.sap.syncStyleClass("sapUiSizeCompact", oView, this._VtwegValueHelp);
			this._VtwegValueHelp.open();

			var VtwegAraDialogModel = new sap.ui.model.json.JSONModel();
			VtwegAraDialogModel.setData({
				filterData: {
					Vtweg: "",
					Vtext: ""
				},
				items: []
			});

			this._VtwegValueHelp.setModel(VtwegAraDialogModel);

		},

		handleVtwegAra: function () {

			sap.ui.core.BusyIndicator.show();
			var oModelVtwegArama = this._VtwegValueHelp.getModel();
			var oDataVtwegArama = oModelVtwegArama.getData();
			var aFilters = [];

			if (oDataVtwegArama.filterData.Vtweg) {
				aFilters.push(new sap.ui.model.Filter("Vtweg", sap.ui.model.FilterOperator.Contains, oDataVtwegArama.filterData.Vtweg));
			}
			if (oDataVtwegArama.filterData.Vtext) {
				aFilters.push(new sap.ui.model.Filter("Vtext", sap.ui.model.FilterOperator.Contains, oDataVtwegArama.filterData.Vtext));
			}

			this.getVtwegData(aFilters);

		},

		getVtwegData: function (filters) {
			var that = this;
			getVtwegSH = [];
			var oDataModel = this.getOwnerComponent().getModel();

			oDataModel.read("/ZbzrShVtwegSet", {
				success: mySuccessHandler,
				error: myErrorHandler,
				filters: filters
			});

			function mySuccessHandler(data, response) {
				getVtwegSH = data.results;
				that.bindView();
				var dialogData = that._VtwegValueHelp.getModel().getData();
				dialogData.items = getVtwegSH;
				that._VtwegValueHelp.getModel().refresh(true);

				sap.ui.core.BusyIndicator.hide();
			}

			function myErrorHandler(response) {
				MessageBox.error("Bir hata oluştu. Lütfen sistem yöneticiniz ile iletişime geçiniz.");
				sap.ui.core.BusyIndicator.hide();
			}
		},

		handleVtwegSec: function (oEvent) {

			var eklenecekVtweg = oEvent.getSource().getBindingContext().getObject();
			this.getView().getModel("oViewModel").getData().taleOnay[TableIndex].Vtweg = eklenecekVtweg.Vtweg;
			this.getView().getModel("oViewModel").refresh(true);
			this._VtwegValueHelp.destroy();

		},

		VtwegValueHelpClose: function () {
			this._VtwegValueHelp.destroy();
		},
		/*ExtwgValueHelp*/
		ExtwgValueHelp: function (oEvent) {
			this._ExtwgValueHelp = sap.ui.getCore().byId("ExtwgValueHelp");
			if (!this._ExtwgValueHelp) {
				this._ExtwgValueHelp = sap.ui.xmlfragment("app.ZBZR_MALZEME.fragments.ExtwgValueHelp", this);
			}

			jQuery.sap.syncStyleClass("sapUiSizeCompact", oView, this._ExtwgValueHelp);
			this._ExtwgValueHelp.open();

			var VtwegAraDialogModel = new sap.ui.model.json.JSONModel();
			VtwegAraDialogModel.setData({
				filterData: {
					Extwg: "",
					Ewbez: ""
				},
				items: []
			});

			this._ExtwgValueHelp.setModel(VtwegAraDialogModel);

		},

		handleExtwgAra: function () {

			sap.ui.core.BusyIndicator.show();
			var oModelVtwegArama = this._ExtwgValueHelp.getModel();
			var oDataVtwegArama = oModelVtwegArama.getData();
			var aFilters = [];

			if (oDataVtwegArama.filterData.Extwg) {
				aFilters.push(new sap.ui.model.Filter("Extwg", sap.ui.model.FilterOperator.Contains, oDataVtwegArama.filterData.Extwg));
			}
			if (oDataVtwegArama.filterData.Ewbez) {
				aFilters.push(new sap.ui.model.Filter("Ewbez", sap.ui.model.FilterOperator.Contains, oDataVtwegArama.filterData.Ewbez));
			}

			this.getExtwgData(aFilters);

		},

		getExtwgData: function (filters) {
			var that = this;
			getExtwgSH = [];
			var oDataModel = this.getOwnerComponent().getModel();

			oDataModel.read("/ZbzrShExtwgSet", {
				success: mySuccessHandler,
				error: myErrorHandler,
				filters: filters
			});

			function mySuccessHandler(data, response) {
				getExtwgSH = data.results;
				that.bindView();
				var dialogData = that._ExtwgValueHelp.getModel().getData();
				dialogData.items = getExtwgSH;
				that._ExtwgValueHelp.getModel().refresh(true);

				sap.ui.core.BusyIndicator.hide();
			}

			function myErrorHandler(response) {
				MessageBox.error("Bir hata oluştu. Lütfen sistem yöneticiniz ile iletişime geçiniz.");
				sap.ui.core.BusyIndicator.hide();
			}
		},

		handleExtwgSec: function (oEvent) {

			var eklenecekExtwg = oEvent.getSource().getBindingContext().getObject();
			this.getView().getModel("FormModel").getData().RequestItems[0].Extwg = eklenecekExtwg.Extwg + "-" + eklenecekExtwg.Ewbez;
			this.getView().getModel("FormModel").refresh(true);
			this._ExtwgValueHelp.destroy();

		},

		ExtwgValueHelpClose: function () {
			this._ExtwgValueHelp.destroy();
		},

		/*TempbValueHelp*/
		TempbValueHelp: function (oEvent) {
			this._TempbValueHelp = sap.ui.getCore().byId("TempbValueHelp");
			if (!this._TempbValueHelp) {
				this._TempbValueHelp = sap.ui.xmlfragment("app.ZBZR_MALZEME.fragments.TempbValueHelp", this);
			}

			jQuery.sap.syncStyleClass("sapUiSizeCompact", oView, this._TempbValueHelp);
			this._TempbValueHelp.open();

			var VtwegAraDialogModel = new sap.ui.model.json.JSONModel();
			VtwegAraDialogModel.setData({
				filterData: {
					Tempb: "",
					Tbtxt: ""
				},
				items: []
			});

			this._TempbValueHelp.setModel(VtwegAraDialogModel);

		},

		handleTempbAra: function () {

			sap.ui.core.BusyIndicator.show();
			var oModelVtwegArama = this._TempbValueHelp.getModel();
			var oDataVtwegArama = oModelVtwegArama.getData();
			var aFilters = [];

			if (oDataVtwegArama.filterData.Tempb) {
				aFilters.push(new sap.ui.model.Filter("Tempb", sap.ui.model.FilterOperator.Contains, oDataVtwegArama.filterData.Tempb));
			}
			if (oDataVtwegArama.filterData.Tbtxt) {
				aFilters.push(new sap.ui.model.Filter("Tbtxt", sap.ui.model.FilterOperator.Contains, oDataVtwegArama.filterData.Tbtxt));
			}

			this.getTempbData(aFilters);

		},

		getTempbData: function (filters) {
			var that = this;
			getTempbSH = [];
			var oDataModel = this.getOwnerComponent().getModel();

			oDataModel.read("/ZbzrShTempbSet", {
				success: mySuccessHandler,
				error: myErrorHandler,
				filters: filters
			});

			function mySuccessHandler(data, response) {
				getTempbSH = data.results;
				that.bindView();
				var dialogData = that._TempbValueHelp.getModel().getData();
				dialogData.items = getTempbSH;
				that._TempbValueHelp.getModel().refresh(true);

				sap.ui.core.BusyIndicator.hide();
			}

			function myErrorHandler(response) {
				MessageBox.error("Bir hata oluştu. Lütfen sistem yöneticiniz ile iletişime geçiniz.");
				sap.ui.core.BusyIndicator.hide();
			}
		},

		handleTempbSec: function (oEvent) {

			var eklenecekTempb = oEvent.getSource().getBindingContext().getObject();
			this.getView().getModel("FormModel").getData().RequestItems[0].Tempb = eklenecekTempb.Tempb;
			this.getView().getModel("FormModel").refresh(true);
			this._TempbValueHelp.destroy();

		},

		TempbValueHelpClose: function () {
			this._TempbValueHelp.destroy();
		},
		/*BarkodValueHelp*/
		Ean11ValueHelp: function (oEvent) {
			var Index = oEvent.getSource().getParent().sId.split("row").length;
			var TalNo = oEvent.getSource().getParent().getCells()[0].mProperties.text;
			TableIndex = this.getView().getModel("oViewModel").getData().taleOnay.findIndex(x => x.Requestid === TalNo);
			this._Ean11ValueHelp = sap.ui.getCore().byId("Ean11ValueHelp");
			if (!this._Ean11ValueHelp) {
				this._Ean11ValueHelp = sap.ui.xmlfragment("app.ZBZR_MALZEME.fragments.Ean11ValueHelp", this);
			}

			jQuery.sap.syncStyleClass("sapUiSizeCompact", oView, this._Ean11ValueHelp);
			this._Ean11ValueHelp.open();

			var VtwegAraDialogModel = new sap.ui.model.json.JSONModel();
			VtwegAraDialogModel.setData({
				filterData: {
					Numtp: "",
					Ntbez: ""
				},
				items: []
			});

			this._Ean11ValueHelp.setModel(VtwegAraDialogModel);

		},

		handleNumtpAra: function () {

			sap.ui.core.BusyIndicator.show();
			var oModelVtwegArama = this._Ean11ValueHelp.getModel();
			var oDataVtwegArama = oModelVtwegArama.getData();
			var aFilters = [];

			if (oDataVtwegArama.filterData.Numtp) {
				aFilters.push(new sap.ui.model.Filter("Numtp", sap.ui.model.FilterOperator.Contains, oDataVtwegArama.filterData.Numtp));
			}
			if (oDataVtwegArama.filterData.Ntbez) {
				aFilters.push(new sap.ui.model.Filter("Ntbez", sap.ui.model.FilterOperator.Contains, oDataVtwegArama.filterData.Ntbez));
			}

			this.getNumtpData(aFilters);

		},

		getNumtpData: function (filters) {
			var that = this;
			getNumtpSH = [];
			var oDataModel = this.getOwnerComponent().getModel();

			oDataModel.read("/ZbzrShEantpSet", {
				success: mySuccessHandler,
				error: myErrorHandler,
				filters: filters
			});

			function mySuccessHandler(data, response) {
				getNumtpSH = data.results;
				that.bindView();
				var dialogData = that._Ean11ValueHelp.getModel().getData();
				dialogData.items = getNumtpSH;
				that._Ean11ValueHelp.getModel().refresh(true);

				sap.ui.core.BusyIndicator.hide();
			}

			function myErrorHandler(response) {
				MessageBox.error("Bir hata oluştu. Lütfen sistem yöneticiniz ile iletişime geçiniz.");
				sap.ui.core.BusyIndicator.hide();
			}
		},

		handleNumtpSec: function (oEvent) {

			var eklenecekNumtp = oEvent.getSource().getBindingContext().getObject();
			this.getView().getModel("oViewModel").getData().taleOnay[TableIndex].Eantp = eklenecekNumtp.Numtp;
			this.getView().getModel("oViewModel").refresh(true);
			this._Ean11ValueHelp.destroy();

		},

		Ean11ValueHelpClose: function () {
			this._Ean11ValueHelp.destroy();
		},
		/*KtgrmValueHelp*/
		KtgrmValueHelp: function (oEvent) {
			var Index = oEvent.getSource().getParent().sId.split("row").length;
			var TalNo = oEvent.getSource().getParent().getCells()[0].mProperties.text;
			TableIndex = this.getView().getModel("oViewModel").getData().taleOnay.findIndex(x => x.Requestid === TalNo);
			this._KtgrmValueHelp = sap.ui.getCore().byId("KtgrmValueHelp");
			if (!this._KtgrmValueHelp) {
				this._KtgrmValueHelp = sap.ui.xmlfragment("app.ZBZR_MALZEME.fragments.KtgrmValueHelp", this);
			}

			jQuery.sap.syncStyleClass("sapUiSizeCompact", oView, this._KtgrmValueHelp);
			this._KtgrmValueHelp.open();

			var VtwegAraDialogModel = new sap.ui.model.json.JSONModel();
			VtwegAraDialogModel.setData({
				filterData: {
					Ktgrm: "",
					Vtext: ""
				},
				items: []
			});

			this._KtgrmValueHelp.setModel(VtwegAraDialogModel);

		},

		handleKtgrmAra: function () {

			sap.ui.core.BusyIndicator.show();
			var oModelVtwegArama = this._KtgrmValueHelp.getModel();
			var oDataVtwegArama = oModelVtwegArama.getData();
			var aFilters = [];

			if (oDataVtwegArama.filterData.Ktgrm) {
				aFilters.push(new sap.ui.model.Filter("Ktgrm", sap.ui.model.FilterOperator.Contains, oDataVtwegArama.filterData.Ktgrm));
			}
			if (oDataVtwegArama.filterData.Vtext) {
				aFilters.push(new sap.ui.model.Filter("Vtext", sap.ui.model.FilterOperator.Contains, oDataVtwegArama.filterData.Vtext));
			}

			this.getKtgrmData(aFilters);

		},

		getKtgrmData: function (filters) {
			var that = this;
			getKtgrmSH = [];
			var oDataModel = this.getOwnerComponent().getModel();

			oDataModel.read("/ZbzrShKtgrmSet", {
				success: mySuccessHandler,
				error: myErrorHandler,
				filters: filters
			});

			function mySuccessHandler(data, response) {
				getKtgrmSH = data.results;
				that.bindView();
				var dialogData = that._KtgrmValueHelp.getModel().getData();
				dialogData.items = getKtgrmSH;
				that._KtgrmValueHelp.getModel().refresh(true);

				sap.ui.core.BusyIndicator.hide();
			}

			function myErrorHandler(response) {
				MessageBox.error("Bir hata oluştu. Lütfen sistem yöneticiniz ile iletişime geçiniz.");
				sap.ui.core.BusyIndicator.hide();
			}
		},

		handleKtgrmSec: function (oEvent) {

			var eklenecekKtgrm = oEvent.getSource().getBindingContext().getObject();
			this.getView().getModel("oViewModel").getData().taleOnay[TableIndex].Ktgrm = eklenecekKtgrm.Ktgrm;
			this.getView().getModel("oViewModel").refresh(true);
			this._KtgrmValueHelp.destroy();

		},

		KtgrmValueHelpClose: function () {
			this._KtgrmValueHelp.destroy();
		},

		/*KschlValueHelp*/
		KschlValueHelp: function (oEvent) {
			this._KschlValueHelp = sap.ui.getCore().byId("KschlValueHelp");
			if (!this._KschlValueHelp) {
				this._KschlValueHelp = sap.ui.xmlfragment("app.ZBZR_MALZEME.fragments.KschlValueHelp", this);
			}

			jQuery.sap.syncStyleClass("sapUiSizeCompact", oView, this._KschlValueHelp);
			this._KschlValueHelp.open();

			var VtwegAraDialogModel = new sap.ui.model.json.JSONModel();
			VtwegAraDialogModel.setData({
				filterData: {
					Kschl: "",
					Vtext: ""
				},
				items: []
			});

			this._KschlValueHelp.setModel(VtwegAraDialogModel);

		},

		handleKschlAra: function () {

			sap.ui.core.BusyIndicator.show();
			var oModelVtwegArama = this._KschlValueHelp.getModel();
			var oDataVtwegArama = oModelVtwegArama.getData();
			var aFilters = [];

			if (oDataVtwegArama.filterData.Kschl) {
				aFilters.push(new sap.ui.model.Filter("Kschl", sap.ui.model.FilterOperator.Contains, oDataVtwegArama.filterData.Kschl));
			}
			if (oDataVtwegArama.filterData.Vtext) {
				aFilters.push(new sap.ui.model.Filter("Vtext", sap.ui.model.FilterOperator.Contains, oDataVtwegArama.filterData.Vtext));
			}

			this.getKschlData(aFilters);

		},

		getKschlData: function (filters) {
			var that = this;
			getKschlSH = [];
			var oDataModel = this.getOwnerComponent().getModel();

			oDataModel.read("/ZbzrShKschlSet", {
				success: mySuccessHandler,
				error: myErrorHandler,
				filters: filters
			});

			function mySuccessHandler(data, response) {
				getKschlSH = data.results;
				that.bindView();
				var dialogData = that._KschlValueHelp.getModel().getData();
				dialogData.items = getKschlSH;
				that._KschlValueHelp.getModel().refresh(true);

				sap.ui.core.BusyIndicator.hide();
			}

			function myErrorHandler(response) {
				MessageBox.error("Bir hata oluştu. Lütfen sistem yöneticiniz ile iletişime geçiniz.");
				sap.ui.core.BusyIndicator.hide();
			}
		},

		handleKschlSec: function (oEvent) {

			var eklenecekKschl = oEvent.getSource().getBindingContext().getObject();
			this.getView().getModel("FormModel").getData().RequestItems[0].Kschl = eklenecekKschl.Kschl;
			this.getView().getModel("FormModel").refresh(true);
			this._KschlValueHelp.destroy();

		},

		KschlValueHelpClose: function () {
			this._KschlValueHelp.destroy();
		},
		/*ModulValueHelp*/
		ModulValueHelp: function (oEvent) {
			this._ModulValueHelp = sap.ui.getCore().byId("ModulValueHelp");
			if (!this._ModulValueHelp) {
				this._ModulValueHelp = sap.ui.xmlfragment("app.ZBZR_MALZEME.fragments.ModulValueHelp", this);
			}

			jQuery.sap.syncStyleClass("sapUiSizeCompact", oView, this._ModulValueHelp);
			this._ModulValueHelp.open();

			var VtwegAraDialogModel = new sap.ui.model.json.JSONModel();
			VtwegAraDialogModel.setData({
				filterData: {
					Skopf: "",
					Vtext: ""
				},
				items: []
			});

			this._ModulValueHelp.setModel(VtwegAraDialogModel);

		},

		handleSkopfAra: function () {

			sap.ui.core.BusyIndicator.show();
			var oModelVtwegArama = this._ModulValueHelp.getModel();
			var oDataVtwegArama = oModelVtwegArama.getData();
			var aFilters = [];

			if (oDataVtwegArama.filterData.Skopf) {
				aFilters.push(new sap.ui.model.Filter("Skopf", sap.ui.model.FilterOperator.Contains, oDataVtwegArama.filterData.Skopf));
			}
			if (oDataVtwegArama.filterData.Vtext) {
				aFilters.push(new sap.ui.model.Filter("Vtext", sap.ui.model.FilterOperator.Contains, oDataVtwegArama.filterData.Vtext));
			}
			aFilters.push(new sap.ui.model.Filter("Spras", sap.ui.model.FilterOperator.Contains, "TR"));
			aFilters.push(new sap.ui.model.Filter("Datab", sap.ui.model.FilterOperator.LE, new Date()));
			aFilters.push(new sap.ui.model.Filter("Datub", sap.ui.model.FilterOperator.GE, new Date()));

			this.getSkopfData(aFilters);

		},

		getSkopfData: function (filters) {
			var that = this;
			getSkopfSH = [];
			var oDataModel = this.getOwnerComponent().getModel();

			oDataModel.read("/WsohaSet", {
				success: mySuccessHandler,
				error: myErrorHandler,
				filters: filters
			});

			function mySuccessHandler(data, response) {
				getSkopfSH = data.results;
				that.bindView();
				var dialogData = that._ModulValueHelp.getModel().getData();
				dialogData.items = getSkopfSH;
				that._ModulValueHelp.getModel().refresh(true);

				sap.ui.core.BusyIndicator.hide();
			}

			function myErrorHandler(response) {
				MessageBox.error("Bir hata oluştu. Lütfen sistem yöneticiniz ile iletişime geçiniz.");
				sap.ui.core.BusyIndicator.hide();
			}
		},

		handleSkopfSec: function (oEvent) {

			var eklenecekSkopf = oEvent.getSource().getBindingContext().getObject();
			this.getView().getModel("FormModel").getData().RequestItems[0].Modul = eklenecekSkopf.Skopf;
			this.getView().getModel("FormModel").refresh(true);
			this._ModulValueHelp.destroy();

		},

		ModulValueHelpClose: function () {
			this._ModulValueHelp.destroy();
		},

		ModulValueHelpSelected: function (evt) {
			var table = sap.ui.getCore().byId("idTableSkopfArama");
			if (table.getSelectedItems().length === 0) {
				MessageToast.show("Modul seçiniz.");
				return;
			}
			var sicildizi = [];
			var models = [];
			var aSelectedItems = table.getSelectedItems();

			//	this.byId("Modul").destroyTokens();
			var oMultiInput = this.byId("Modul");

			if (aSelectedItems && aSelectedItems.length > 0) {
				aSelectedItems.forEach(function (oItem) {
					oMultiInput.addToken(new Token({
						text: oItem.getBindingContext().getObject().Skopf
					}));
				});
			}
			this.ModulValueHelpClose();
		},

		ModulValueHelpChange: function (oEvent) {

			if (oEvent.getParameters().type === "removedAll") {
				this.byId("Modul").destroyTokens();
			}
		},

		onTokenChange: function (oEvent) {

		},

		/*ZPergroupValueHelp*/
		ZPergroupValueHelp: function (oEvent) {
			this._ZPergroupValueHelp = sap.ui.getCore().byId("ZPergroupValueHelp");
			if (!this._ZPergroupValueHelp) {
				this._ZPergroupValueHelp = sap.ui.xmlfragment("app.ZBZR_MALZEME.fragments.ZPergroupValueHelp", this);
			}

			jQuery.sap.syncStyleClass("sapUiSizeCompact", oView, this._ZPergroupValueHelp);
			this._ZPergroupValueHelp.open();

			var VtwegAraDialogModel = new sap.ui.model.json.JSONModel();
			VtwegAraDialogModel.setData({
				filterData: {
					Class: "",
					Kschg: ""
				},
				items: []
			});

			this._ZPergroupValueHelp.setModel(VtwegAraDialogModel);

		},

		handleClassAra: function () {

			sap.ui.core.BusyIndicator.show();
			var oModelVtwegArama = this._ZPergroupValueHelp.getModel();
			var oDataVtwegArama = oModelVtwegArama.getData();
			var aFilters = [];

			if (oDataVtwegArama.filterData.Class) {
				aFilters.push(new sap.ui.model.Filter("Class", sap.ui.model.FilterOperator.Contains, oDataVtwegArama.filterData.Class));
			}
			if (oDataVtwegArama.filterData.Kschg) {
				aFilters.push(new sap.ui.model.Filter("Kschg", sap.ui.model.FilterOperator.Contains, oDataVtwegArama.filterData.Kschg));
			}
			if (Sirket === "2900") {
				this.getClassData1(aFilters);
			} else {
				this.getClassData(aFilters);
			}

		},

		getClassData: function (filters) {
			var that = this;
			getClassSH = [];
			var oDataModel = this.getOwnerComponent().getModel();

			oDataModel.read("/ZbzrShPergrpSet", {
				success: mySuccessHandler,
				error: myErrorHandler,
				filters: filters
			});

			function mySuccessHandler(data, response) {
				getClassSH = data.results;
				that.bindView();
				var dialogData = that._ZPergroupValueHelp.getModel().getData();
				dialogData.items = getClassSH;
				that._ZPergroupValueHelp.getModel().refresh(true);

				sap.ui.core.BusyIndicator.hide();
			}

			function myErrorHandler(response) {
				MessageBox.error("Bir hata oluştu. Lütfen sistem yöneticiniz ile iletişime geçiniz.");
				sap.ui.core.BusyIndicator.hide();
			}
		},
		getClassData1: function (filters) {
			var that = this;
			getClassSH = [];
			var oDataModel = this.getOwnerComponent().getModel();

			oDataModel.read("/ZbzrShPergrp1Set", {
				success: mySuccessHandler,
				error: myErrorHandler,
				filters: filters
			});

			function mySuccessHandler(data, response) {
				getClassSH = data.results;
				that.bindView();
				var dialogData = that._ZPergroupValueHelp.getModel().getData();
				dialogData.items = getClassSH;
				that._ZPergroupValueHelp.getModel().refresh(true);

				sap.ui.core.BusyIndicator.hide();
			}

			function myErrorHandler(response) {
				MessageBox.error("Bir hata oluştu. Lütfen sistem yöneticiniz ile iletişime geçiniz.");
				sap.ui.core.BusyIndicator.hide();
			}
		},

		handleClassSec: function (oEvent) {

			var eklenecekClass = oEvent.getSource().getBindingContext().getObject();
			if (Sirket === "2900") {
				this.getView().getModel("FormModel").getData().RequestItems[0].ZPergroup1 = eklenecekClass.Class;
				this.getView().getModel("FormModel").getData().RequestItems[0].ZPergroupAd1 = eklenecekClass.Kschg;
			} else {
				this.getView().getModel("FormModel").getData().RequestItems[0].ZPergroup = eklenecekClass.Class;
				this.getView().getModel("FormModel").getData().RequestItems[0].ZPergroupAd = eklenecekClass.Kschg;
			}
			this.getView().getModel("FormModel").refresh(true);
			this._ZPergroupValueHelp.destroy();

		},

		ZPergroupValueHelpClose: function () {
			this._ZPergroupValueHelp.destroy();
		},

		/*FaxNumberValueHelp*/
		FaxNumberValueHelp: function (oEvent) {
			this._FaxNumberValueHelp = sap.ui.getCore().byId("FaxNumberValueHelp");
			if (!this._FaxNumberValueHelp) {
				this._FaxNumberValueHelp = sap.ui.xmlfragment("app.ZBZR_MALZEME.fragments.FaxNumberValueHelp", this);
			}

			jQuery.sap.syncStyleClass("sapUiSizeCompact", oView, this._FaxNumberValueHelp);
			this._FaxNumberValueHelp.open();

			var VtwegAraDialogModel = new sap.ui.model.json.JSONModel();
			VtwegAraDialogModel.setData({
				filterData: {
					FaxNumber: ""
				},
				items: []
			});

			this._FaxNumberValueHelp.setModel(VtwegAraDialogModel);

		},

		handleFaxNumberAra: function () {

			sap.ui.core.BusyIndicator.show();
			var oModelVtwegArama = this._FaxNumberValueHelp.getModel();
			var oDataVtwegArama = oModelVtwegArama.getData();
			var aFilters = [];

			if (oDataVtwegArama.filterData.FaxNumber) {
				aFilters.push(new sap.ui.model.Filter("FaxNumber", sap.ui.model.FilterOperator.Contains, oDataVtwegArama.filterData.FaxNumber));
			}

			this.getFaxNumberData(aFilters);

		},

		getFaxNumberData: function (filters) {
			var that = this;
			getFaxNumberSH = [];
			var oDataModel = this.getOwnerComponent().getModel();

			oDataModel.read("/ZbzrShFaxnumSet", {
				success: mySuccessHandler,
				error: myErrorHandler,
				filters: filters
			});

			function mySuccessHandler(data, response) {
				var result = [];
				var map = new Map();
				for (var item of data.results) {
					if (!map.has(item.FaxNumber)) {
						map.set(item.FaxNumber, true);
						result.push(item);
					}
				}
				getFaxNumberSH = result;
				that.bindView();
				var dialogData = that._FaxNumberValueHelp.getModel().getData();
				dialogData.items = getFaxNumberSH;
				that._FaxNumberValueHelp.getModel().refresh(true);

				sap.ui.core.BusyIndicator.hide();
			}

			function myErrorHandler(response) {
				MessageBox.error("Bir hata oluştu. Lütfen sistem yöneticiniz ile iletişime geçiniz.");
				sap.ui.core.BusyIndicator.hide();
			}
		},

		handleFaxNumberSec: function (oEvent) {

			var eklenecekFaxNumber = oEvent.getSource().getBindingContext().getObject();
			this.getView().getModel("FormModel").getData().RequestItems[0].FaxNumber = eklenecekFaxNumber.FaxNumber;
			this.getView().getModel("FormModel").refresh(true);
			this._FaxNumberValueHelp.destroy();

		},

		FaxNumberValueHelpClose: function () {
			this._FaxNumberValueHelp.destroy();
		},

		/*Meins*/
		MeinsValueHelpRev: function (oEvent) {
			var Index = oEvent.getSource().getParent().sId.split("row").length;
			var TalNo = oEvent.getSource().getParent().getCells()[0].mProperties.text;
			TableIndex = this.getView().getModel("oViewModel").getData().taleOnay.findIndex(x => x.Requestid === TalNo);
			this._MeinsValueHelpRev = sap.ui.getCore().byId("MeinsValueHelpRev");
			if (!this._MeinsValueHelpRev) {
				this._MeinsValueHelpRev = sap.ui.xmlfragment("app.ZBZR_MALZEME.fragments.MeinsValueHelpRev", this);
			}

			jQuery.sap.syncStyleClass("sapUiSizeCompact", oView, this._MeinsValueHelpRev);
			this._MeinsValueHelpRev.open();

			var MeinsAraDialogModel = new sap.ui.model.json.JSONModel();
			MeinsAraDialogModel.setData({
				filterData: {
					Mseh3: ""
				},
				items: []
			});

			this._MeinsValueHelpRev.setModel(MeinsAraDialogModel);

		},

		handleMeinsRevAra: function () {

			sap.ui.core.BusyIndicator.show();
			var oModelMeinsArama = this._MeinsValueHelpRev.getModel();
			var oDataMeinsArama = oModelMeinsArama.getData();
			var aFilters = [];

			if (oDataMeinsArama.filterData.Mseh3) {
				aFilters.push(new sap.ui.model.Filter("Mseh3", sap.ui.model.FilterOperator.Contains, oDataMeinsArama.filterData.Mseh3));
			}

			this.getMeinsRevData(aFilters);

		},

		getMeinsRevData: function (filters) {
			var that = this;
			getMeinsSH = [];
			var oDataModel = this.getOwnerComponent().getModel();

			oDataModel.read("/ZbzrShMeinsSet", {
				success: mySuccessHandler,
				error: myErrorHandler,
				filters: filters
			});

			function mySuccessHandler(data, response) {
				getMeinsSH = data.results;
				that.bindView();
				var dialogData = that._MeinsValueHelpRev.getModel().getData();
				dialogData.items = getMeinsSH;
				that._MeinsValueHelpRev.getModel().refresh(true);

				sap.ui.core.BusyIndicator.hide();
			}

			function myErrorHandler(response) {
				MessageBox.error("Bir hata oluştu. Lütfen sistem yöneticiniz ile iletişime geçiniz.");
				sap.ui.core.BusyIndicator.hide();
			}
		},

		handleMeinsRevSec: function (oEvent) {

			var eklenecekMeins = oEvent.getSource().getBindingContext().getObject();
			this.getView().getModel("oViewModel").getData().taleOnay[TableIndex].Meins = eklenecekMeins.Mseh3;
			this.getView().getModel("oViewModel").refresh(true);
			this._MeinsValueHelpRev.destroy();

		},

		MeinsValueHelpRevClose: function () {
			this._MeinsValueHelpRev.destroy();
		},
		/*FaxNumberRev*/
		FaxNumberValueHelpRev: function (oEvent) {
			var Index = oEvent.getSource().getParent().sId.split("row").length;
			var TalNo = oEvent.getSource().getParent().getCells()[0].mProperties.text;
			TableIndex = this.getView().getModel("oViewModel").getData().taleOnay.findIndex(x => x.Requestid === TalNo);
			this._FaxNumberValueHelpRev = sap.ui.getCore().byId("FaxNumberValueHelpRev");
			if (!this._FaxNumberValueHelpRev) {
				this._FaxNumberValueHelpRev = sap.ui.xmlfragment("app.ZBZR_MALZEME.fragments.FaxNumberValueHelpRev", this);
			}

			jQuery.sap.syncStyleClass("sapUiSizeCompact", oView, this._FaxNumberValueHelpRev);
			this._FaxNumberValueHelpRev.open();

			var VtwegAraDialogModel = new sap.ui.model.json.JSONModel();
			VtwegAraDialogModel.setData({
				filterData: {
					FaxNumber: ""
				},
				items: []
			});

			this._FaxNumberValueHelpRev.setModel(VtwegAraDialogModel);

		},

		handleFaxNumberAraRev: function () {

			sap.ui.core.BusyIndicator.show();
			var oModelVtwegArama = this._FaxNumberValueHelpRev.getModel();
			var oDataVtwegArama = oModelVtwegArama.getData();
			var aFilters = [];

			if (oDataVtwegArama.filterData.FaxNumber) {
				aFilters.push(new sap.ui.model.Filter("FaxNumber", sap.ui.model.FilterOperator.Contains, oDataVtwegArama.filterData.FaxNumber));
			}

			this.getFaxNumberDataRev(aFilters);

		},

		getFaxNumberDataRev: function (filters) {
			var that = this;
			getFaxNumberSH = [];
			var oDataModel = this.getOwnerComponent().getModel();

			oDataModel.read("/ZbzrShFaxnumSet", {
				success: mySuccessHandler,
				error: myErrorHandler,
				filters: filters
			});

			function mySuccessHandler(data, response) {
				var result = [];
				var map = new Map();
				for (var item of data.results) {
					if (!map.has(item.FaxNumber)) {
						map.set(item.FaxNumber, true);
						result.push(item);
					}
				}
				getFaxNumberSH = result;
				that.bindView();
				var dialogData = that._FaxNumberValueHelpRev.getModel().getData();
				dialogData.items = getFaxNumberSH;
				that._FaxNumberValueHelpRev.getModel().refresh(true);

				sap.ui.core.BusyIndicator.hide();
			}

			function myErrorHandler(response) {
				MessageBox.error("Bir hata oluştu. Lütfen sistem yöneticiniz ile iletişime geçiniz.");
				sap.ui.core.BusyIndicator.hide();
			}
		},

		handleFaxNumberSecRev: function (oEvent) {

			var eklenecekFaxNumber = oEvent.getSource().getBindingContext().getObject();
			this.getView().getModel("oViewModel").getData().taleOnay[TableIndex].FaxNumber = eklenecekFaxNumber.FaxNumber;
			this.getView().getModel("oViewModel").refresh(true);
			this._FaxNumberValueHelpRev.destroy();

		},

		FaxNumberValueHelpRevClose: function () {
			this._FaxNumberValueHelpRev.destroy();
		},
		/*Tedarik*/
		SobslValueHelpRev: function (oEvent) {
			var Index = oEvent.getSource().getParent().sId.split("row").length;
			var TalNo = oEvent.getSource().getParent().getCells()[0].mProperties.text;
			TableIndex = this.getView().getModel("oViewModel").getData().taleOnay.findIndex(x => x.Requestid === TalNo);
			this._SobslValueHelpRev = sap.ui.getCore().byId("SobslValueHelpRev");
			if (!this._SobslValueHelpRev) {
				this._SobslValueHelpRev = sap.ui.xmlfragment("app.ZBZR_MALZEME.fragments.SobslValueHelpRev", this);
			}

			jQuery.sap.syncStyleClass("sapUiSizeCompact", oView, this._SobslValueHelpRev);
			this._SobslValueHelpRev.open();

			var SobslAraDialogModel = new sap.ui.model.json.JSONModel();
			SobslAraDialogModel.setData({
				filterData: {
					Werks: "",
					Sobsl: ""
				},
				items: []
			});

			this._SobslValueHelpRev.setModel(SobslAraDialogModel);

		},

		handleSobslAraRev: function () {

			sap.ui.core.BusyIndicator.show();
			var oModelSobslArama = this._SobslValueHelpRev.getModel();
			var oDataSobslArama = oModelSobslArama.getData();
			var aFilters = [];

			if (oDataSobslArama.filterData.Werks) {
				aFilters.push(new sap.ui.model.Filter("Werks", sap.ui.model.FilterOperator.Contains, oDataSobslArama.filterData.Werks));
			}
			if (oDataSobslArama.filterData.Sobsl) {
				aFilters.push(new sap.ui.model.Filter("Sobsl", sap.ui.model.FilterOperator.Contains, oDataSobslArama.filterData.Sobsl));
			}

			this.getSobslDataRev(aFilters);

		},

		getSobslDataRev: function (filters) {
			var that = this;
			getSobslSH = [];
			var oDataModel = this.getOwnerComponent().getModel();

			oDataModel.read("/ZbzrShSobslSet", {
				success: mySuccessHandler,
				error: myErrorHandler,
				filters: filters
			});

			function mySuccessHandler(data, response) {
				getSobslSH = data.results;
				that.bindView();
				var dialogData = that._SobslValueHelpRev.getModel().getData();
				dialogData.items = getSobslSH;
				that._SobslValueHelpRev.getModel().refresh(true);

				sap.ui.core.BusyIndicator.hide();
			}

			function myErrorHandler(response) {
				MessageBox.error("Bir hata oluştu. Lütfen sistem yöneticiniz ile iletişime geçiniz.");
				sap.ui.core.BusyIndicator.hide();
			}
		},

		handleSobslSecRev: function (oEvent) {

			var eklenecekSobsl = oEvent.getSource().getBindingContext().getObject();
			this.getView().getModel("oViewModel").getData().taleOnay[TableIndex].Sobsl = eklenecekSobsl.Sobsl;
			this.getView().getModel("oViewModel").refresh(true);
			this._SobslValueHelpRev.destroy();

		},

		SobslValueHelpRevClose: function () {
			this._SobslValueHelpRev.destroy();
		},

		/*KschlValueHelpRev*/
		KschlValueHelpRev: function (oEvent) {
			var Index = oEvent.getSource().getParent().sId.split("row").length;
			var TalNo = oEvent.getSource().getParent().getCells()[0].mProperties.text;
			TableIndex = this.getView().getModel("oViewModel").getData().taleOnay.findIndex(x => x.Requestid === TalNo);
			this._KschlValueHelpRev = sap.ui.getCore().byId("KschlValueHelpRev");
			if (!this._KschlValueHelpRev) {
				this._KschlValueHelpRev = sap.ui.xmlfragment("app.ZBZR_MALZEME.fragments.KschlValueHelpRev", this);
			}

			jQuery.sap.syncStyleClass("sapUiSizeCompact", oView, this._KschlValueHelpRev);
			this._KschlValueHelpRev.open();

			var VtwegAraDialogModel = new sap.ui.model.json.JSONModel();
			VtwegAraDialogModel.setData({
				filterData: {
					Kschl: "",
					Vtext: ""
				},
				items: []
			});

			this._KschlValueHelpRev.setModel(VtwegAraDialogModel);

		},

		handleKschlAraRev: function () {

			sap.ui.core.BusyIndicator.show();
			var oModelVtwegArama = this._KschlValueHelpRev.getModel();
			var oDataVtwegArama = oModelVtwegArama.getData();
			var aFilters = [];

			if (oDataVtwegArama.filterData.Kschl) {
				aFilters.push(new sap.ui.model.Filter("Kschl", sap.ui.model.FilterOperator.Contains, oDataVtwegArama.filterData.Kschl));
			}
			if (oDataVtwegArama.filterData.Vtext) {
				aFilters.push(new sap.ui.model.Filter("Vtext", sap.ui.model.FilterOperator.Contains, oDataVtwegArama.filterData.Vtext));
			}

			this.getKschlDataRev(aFilters);

		},

		getKschlDataRev: function (filters) {
			var that = this;
			getKschlSH = [];
			var oDataModel = this.getOwnerComponent().getModel();

			oDataModel.read("/ZbzrShKschlSet", {
				success: mySuccessHandler,
				error: myErrorHandler,
				filters: filters
			});

			function mySuccessHandler(data, response) {
				getKschlSH = data.results;
				that.bindView();
				var dialogData = that._KschlValueHelpRev.getModel().getData();
				dialogData.items = getKschlSH;
				that._KschlValueHelpRev.getModel().refresh(true);

				sap.ui.core.BusyIndicator.hide();
			}

			function myErrorHandler(response) {
				MessageBox.error("Bir hata oluştu. Lütfen sistem yöneticiniz ile iletişime geçiniz.");
				sap.ui.core.BusyIndicator.hide();
			}
		},

		handleKschlSecRev: function (oEvent) {

			var eklenecekKschl = oEvent.getSource().getBindingContext().getObject();
			this.getView().getModel("oViewModel").getData().taleOnay[TableIndex].Kschl = eklenecekKschl.Kschl;
			this.getView().getModel("oViewModel").refresh(true);
			this._KschlValueHelpRev.destroy();

		},

		KschlValueHelpRevClose: function () {
			this._KschlValueHelpRev.destroy();
		},

		/*Satıcı Kodu*/
		LifnrValueHelpRev: function (oEvent) {
			var Index = oEvent.getSource().getParent().sId.split("row").length;
			var TalNo = oEvent.getSource().getParent().getCells()[0].mProperties.text;
			TableIndex = this.getView().getModel("oViewModel").getData().taleOnay.findIndex(x => x.Requestid === TalNo);
			this._LifnrValueHelpRev = sap.ui.getCore().byId("LifnrValueHelpRev");
			if (!this._LifnrValueHelpRev) {
				this._LifnrValueHelpRev = sap.ui.xmlfragment("app.ZBZR_MALZEME.fragments.LifnrValueHelpRev", this);
			}

			jQuery.sap.syncStyleClass("sapUiSizeCompact", oView, this._LifnrValueHelpRev);
			this._LifnrValueHelpRev.open();

			var LifnrAraDialogModel = new sap.ui.model.json.JSONModel();
			LifnrAraDialogModel.setData({
				filterData: {
					Mcod1: "",
					Lifnr: ""
				},
				items: []
			});

			this._LifnrValueHelpRev.setModel(LifnrAraDialogModel);

		},

		handleLifnrAraRev: function () {

			sap.ui.core.BusyIndicator.show();
			var oModelLifnrArama = this._LifnrValueHelpRev.getModel();
			var oDataLifnrArama = oModelLifnrArama.getData();
			var aFilters = [];

			if (oDataLifnrArama.filterData.Mcod1) {
				aFilters.push(new sap.ui.model.Filter("Mcod1", sap.ui.model.FilterOperator.Contains, oDataLifnrArama.filterData.Mcod1));
			}
			if (oDataLifnrArama.filterData.Lifnr) {
				aFilters.push(new sap.ui.model.Filter("Lifnr", sap.ui.model.FilterOperator.Contains, oDataLifnrArama.filterData.Lifnr));
			}

			this.getLifnrDataRev(aFilters);

		},

		getLifnrDataRev: function (filters) {
			var that = this;
			getLifnrSH = [];
			var oDataModel = this.getOwnerComponent().getModel();

			oDataModel.read("/ZbzrShLfa1Set", {
				success: mySuccessHandler,
				error: myErrorHandler,
				filters: filters
			});

			function mySuccessHandler(data, response) {
				getLifnrSH = data.results;
				that.bindView();
				var dialogData = that._LifnrValueHelpRev.getModel().getData();
				dialogData.items = getLifnrSH;
				that._LifnrValueHelpRev.getModel().refresh(true);

				sap.ui.core.BusyIndicator.hide();
			}

			function myErrorHandler(response) {
				MessageBox.error("Bir hata oluştu. Lütfen sistem yöneticiniz ile iletişime geçiniz.");
				sap.ui.core.BusyIndicator.hide();
			}
		},

		handleLifnrSecRev: function (oEvent) {

			var eklenecekLifnr = oEvent.getSource().getBindingContext().getObject();
			this.getView().getModel("oViewModel").getData().taleOnay[TableIndex].Lifnr = eklenecekLifnr.Lifnr;
			this.getView().getModel("oViewModel").getData().taleOnay[TableIndex].Name1 = eklenecekLifnr.Mcod1;
			this.getView().getModel("oViewModel").refresh(true);
			this._LifnrValueHelpRev.destroy();

		},

		LifnrValueHelpRevClose: function () {
			this._LifnrValueHelpRev.destroy();
		},

		/*SatışRev*/
		TaklvValueHelpRev: function (oEvent) {
			var Index = oEvent.getSource().getParent().sId.split("row").length;
			var TalNo = oEvent.getSource().getParent().getCells()[0].mProperties.text;
			TableIndex = this.getView().getModel("oViewModel").getData().taleOnay.findIndex(x => x.Requestid === TalNo);
			this._TaklvValueHelpRev = sap.ui.getCore().byId("TaklvValueHelpRev");
			if (!this._TaklvValueHelpRev) {
				this._TaklvValueHelpRev = sap.ui.xmlfragment("app.ZBZR_MALZEME.fragments.TaklvValueHelpRev", this);
			}

			jQuery.sap.syncStyleClass("sapUiSizeCompact", oView, this._TaklvValueHelpRev);
			this._TaklvValueHelpRev.open();

			var TaklvAraDialogModel = new sap.ui.model.json.JSONModel();
			TaklvAraDialogModel.setData({
				filterData: {
					Vtext: "",
					Taxkm: ""
				},
				items: []
			});

			this._TaklvValueHelpRev.setModel(TaklvAraDialogModel);

		},

		handleTaklvAraRev: function () {

			sap.ui.core.BusyIndicator.show();
			var oModelTaklvArama = this._TaklvValueHelpRev.getModel();
			var oDataTaklvArama = oModelTaklvArama.getData();
			var aFilters = [];

			if (oDataTaklvArama.filterData.Vtext) {
				aFilters.push(new sap.ui.model.Filter("Vtext", sap.ui.model.FilterOperator.Contains, oDataTaklvArama.filterData.Vtext));
			}
			if (oDataTaklvArama.filterData.Taxkm) {
				aFilters.push(new sap.ui.model.Filter("Taxkm", sap.ui.model.FilterOperator.Contains, oDataTaklvArama.filterData.Taxkm));
			}

			this.getTaklvDataRev(aFilters);

		},

		getTaklvDataRev: function (filters) {
			var that = this;
			getTaklvSH = [];
			var oDataModel = this.getOwnerComponent().getModel();

			oDataModel.read("/ZbzrShTskmSet", {
				success: mySuccessHandler,
				error: myErrorHandler,
				filters: filters
			});

			function mySuccessHandler(data, response) {
				getTaklvSH = data.results;
				that.bindView();
				var dialogData = that._TaklvValueHelpRev.getModel().getData();
				dialogData.items = getTaklvSH;
				that._TaklvValueHelpRev.getModel().refresh(true);

				sap.ui.core.BusyIndicator.hide();
			}

			function myErrorHandler(response) {
				MessageBox.error("Bir hata oluştu. Lütfen sistem yöneticiniz ile iletişime geçiniz.");
				sap.ui.core.BusyIndicator.hide();
			}
		},

		handleTaklvSecRev: function (oEvent) {

			var eklenecekTaklv = oEvent.getSource().getBindingContext().getObject();
			this.getView().getModel("oViewModel").getData().taleOnay[TableIndex].Taklv = eklenecekTaklv.Taxkm;
			this.getView().getModel("oViewModel").refresh(true);
			this._TaklvValueHelpRev.destroy();

		},

		TaklvValueHelpRevClose: function () {
			this._TaklvValueHelpRev.destroy();
		},

		/*AlışRev*/
		MwskzValueHelpRev: function (oEvent) {
			var Index = oEvent.getSource().getParent().sId.split("row").length;
			var TalNo = oEvent.getSource().getParent().getCells()[0].mProperties.text;
			TableIndex = this.getView().getModel("oViewModel").getData().taleOnay.findIndex(x => x.Requestid === TalNo);
			this._MwskzValueHelpRev = sap.ui.getCore().byId("MwskzValueHelpRev");
			if (!this._MwskzValueHelpRev) {
				this._MwskzValueHelpRev = sap.ui.xmlfragment("app.ZBZR_MALZEME.fragments.MwskzValueHelpRev", this);
			}

			jQuery.sap.syncStyleClass("sapUiSizeCompact", oView, this._MwskzValueHelpRev);
			this._MwskzValueHelpRev.open();

			var MwskzAraDialogModel = new sap.ui.model.json.JSONModel();
			MwskzAraDialogModel.setData({
				filterData: {
					Text1: "",
					Mwskz: ""
				},
				items: []
			});

			this._MwskzValueHelpRev.setModel(MwskzAraDialogModel);

		},

		handleMwskzAraRev: function () {

			sap.ui.core.BusyIndicator.show();
			var oModelMwskzArama = this._MwskzValueHelpRev.getModel();
			var oDataMwskzArama = oModelMwskzArama.getData();
			var aFilters = [];

			if (oDataMwskzArama.filterData.Text1) {
				aFilters.push(new sap.ui.model.Filter("Text1", sap.ui.model.FilterOperator.Contains, oDataMwskzArama.filterData.Text1));
			}
			if (oDataMwskzArama.filterData.Mwskz) {
				aFilters.push(new sap.ui.model.Filter("Mwskz", sap.ui.model.FilterOperator.Contains, oDataMwskzArama.filterData.Mwskz));
			}

			this.getMwskzDataRev(aFilters);

		},

		getMwskzDataRev: function (filters) {
			var that = this;
			getMwskzSH = [];
			var oDataModel = this.getOwnerComponent().getModel();

			oDataModel.read("/ZbzrShMskwzSet", {
				success: mySuccessHandler,
				error: myErrorHandler,
				filters: filters
			});

			function mySuccessHandler(data, response) {
				getMwskzSH = data.results;
				that.bindView();
				var dialogData = that._MwskzValueHelpRev.getModel().getData();
				dialogData.items = getMwskzSH;
				that._MwskzValueHelpRev.getModel().refresh(true);

				sap.ui.core.BusyIndicator.hide();
			}

			function myErrorHandler(response) {
				MessageBox.error("Bir hata oluştu. Lütfen sistem yöneticiniz ile iletişime geçiniz.");
				sap.ui.core.BusyIndicator.hide();
			}
		},

		handleMwskzSecRev: function (oEvent) {

			var eklenecekMwskz = oEvent.getSource().getBindingContext().getObject();
			this.getView().getModel("oViewModel").getData().taleOnay[TableIndex].Mwskz = eklenecekMwskz.Mwskz;
			this.getView().getModel("oViewModel").refresh(true);
			this._MwskzValueHelpRev.destroy();

		},

		MwskzValueHelpRevClose: function () {
			this._MwskzValueHelpRev.destroy();
		},

		/*Inhme*/
		InhmeValueHelpRev: function (oEvent) {
			var Index = oEvent.getSource().getParent().sId.split("row").length;
			var TalNo = oEvent.getSource().getParent().getCells()[0].mProperties.text;
			TableIndex = this.getView().getModel("oViewModel").getData().taleOnay.findIndex(x => x.Requestid === TalNo);
			this._InhmeValueHelpRev = sap.ui.getCore().byId("InhmeValueHelpRev");
			if (!this._InhmeValueHelpRev) {
				this._InhmeValueHelpRev = sap.ui.xmlfragment("app.ZBZR_MALZEME.fragments.InhmeValueHelpRev", this);
			}

			jQuery.sap.syncStyleClass("sapUiSizeCompact", oView, this._InhmeValueHelpRev);
			this._InhmeValueHelpRev.open();

			var InhmeAraDialogModel = new sap.ui.model.json.JSONModel();
			InhmeAraDialogModel.setData({
				filterData: {
					Mseh3: ""
				},
				items: []
			});

			this._InhmeValueHelpRev.setModel(InhmeAraDialogModel);

		},

		handleInhmeAraRev: function () {

			sap.ui.core.BusyIndicator.show();
			var oModelInhmeArama = this._InhmeValueHelpRev.getModel();
			var oDataInhmeArama = oModelInhmeArama.getData();
			var aFilters = [];

			if (oDataInhmeArama.filterData.Mseh3) {
				aFilters.push(new sap.ui.model.Filter("Mseh3", sap.ui.model.FilterOperator.Contains, oDataInhmeArama.filterData.Mseh3));
			}

			this.getInhmeDataRev(aFilters);

		},

		getInhmeDataRev: function (filters) {
			var that = this;
			getInhmeSH = [];
			var oDataModel = this.getOwnerComponent().getModel();

			oDataModel.read("/ZbzrShMeinsSet", {
				success: mySuccessHandler,
				error: myErrorHandler,
				filters: filters
			});

			function mySuccessHandler(data, response) {
				getInhmeSH = data.results;
				that.bindView();
				var dialogData = that._InhmeValueHelpRev.getModel().getData();
				dialogData.items = getInhmeSH;
				that._InhmeValueHelpRev.getModel().refresh(true);

				sap.ui.core.BusyIndicator.hide();
			}

			function myErrorHandler(response) {
				MessageBox.error("Bir hata oluştu. Lütfen sistem yöneticiniz ile iletişime geçiniz.");
				sap.ui.core.BusyIndicator.hide();
			}
		},

		handleInhmeSecRev: function (oEvent) {

			var eklenecekInhme = oEvent.getSource().getBindingContext().getObject();
			this.getView().getModel("oViewModel").getData().taleOnay[TableIndex].Inhme = eklenecekInhme.Mseh3;
			this.getView().getModel("oViewModel").refresh(true);
			this._InhmeValueHelpRev.destroy();

		},

		InhmeValueHelpRevClose: function () {
			this._InhmeValueHelpRev.destroy();
		},

		/*Mal Kodu Rev*/
		MatklValueHelpRev: function (oEvent) {
			var Index = oEvent.getSource().getParent().sId.split("row").length;
			var TalNo = oEvent.getSource().getParent().getCells()[0].mProperties.text;
			TableIndex = this.getView().getModel("oViewModel").getData().taleOnay.findIndex(x => x.Requestid === TalNo);
			this._MatklValueHelpRev = sap.ui.getCore().byId("MatklValueHelpRev");
			if (!this._MatklValueHelpRev) {
				this._MatklValueHelpRev = sap.ui.xmlfragment("app.ZBZR_MALZEME.fragments.MatklValueHelpRev", this);
			}

			jQuery.sap.syncStyleClass("sapUiSizeCompact", oView, this._MatklValueHelpRev);
			this._MatklValueHelpRev.open();

			var MatklAraDialogModel = new sap.ui.model.json.JSONModel();
			MatklAraDialogModel.setData({
				filterData: {
					Matkl: "",
					Wgbez: ""
				},
				items: []
			});

			this._MatklValueHelpRev.setModel(MatklAraDialogModel);

		},

		handleMatklAraRev: function () {

			sap.ui.core.BusyIndicator.show();
			var oModelMatklArama = this._MatklValueHelpRev.getModel();
			var oDataMatklArama = oModelMatklArama.getData();
			var aFilters = [];

			if (oDataMatklArama.filterData.Matkl) {
				aFilters.push(new sap.ui.model.Filter("Matkl", sap.ui.model.FilterOperator.Contains, oDataMatklArama.filterData.Matkl));
			}
			if (oDataMatklArama.filterData.Wgbez) {
				aFilters.push(new sap.ui.model.Filter("Wgbez", sap.ui.model.FilterOperator.Contains, oDataMatklArama.filterData.Wgbez));
			}

			this.getMatklDataRev(aFilters);

		},

		getMatklDataRev: function (filters) {
			var that = this;
			getMatklSH = [];
			var oDataModel = this.getOwnerComponent().getModel();

			oDataModel.read("/ZbzrShT023Set", {
				success: mySuccessHandler,
				error: myErrorHandler,
				filters: filters
			});

			function mySuccessHandler(data, response) {
				getMatklSH = data.results;
				that.bindView();
				var dialogData = that._MatklValueHelpRev.getModel().getData();
				dialogData.items = getMatklSH;
				that._MatklValueHelpRev.getModel().refresh(true);

				sap.ui.core.BusyIndicator.hide();
			}

			function myErrorHandler(response) {
				MessageBox.error("Bir hata oluştu. Lütfen sistem yöneticiniz ile iletişime geçiniz.");
				sap.ui.core.BusyIndicator.hide();
			}
		},

		handleMatklSecRev: function (oEvent) {

			var eklenecekMatkl = oEvent.getSource().getBindingContext().getObject();
			this.getView().getModel("oViewModel").getData().taleOnay[TableIndex].Matkl = eklenecekMatkl.Matkl;
			this.getView().getModel("oViewModel").getData().taleOnay[TableIndex].Wgbez = eklenecekMatkl.Wgbez;
			this.getView().getModel("oViewModel").refresh(true);
			this._MatklValueHelpRev.destroy();

		},

		MatklValueHelpRevClose: function () {
			this._MatklValueHelpRev.destroy();
		},

		/*Marka Kodu Rev*/
		BrandIdValueHelpRev: function (oEvent) {
			var Index = oEvent.getSource().getParent().sId.split("row").length;
			var TalNo = oEvent.getSource().getParent().getCells()[0].mProperties.text;
			TableIndex = this.getView().getModel("oViewModel").getData().taleOnay.findIndex(x => x.Requestid === TalNo);
			this._BrandIdValueHelpRev = sap.ui.getCore().byId("BrandIdValueHelpRev");
			if (!this._BrandIdValueHelpRev) {
				this._BrandIdValueHelpRev = sap.ui.xmlfragment("app.ZBZR_MALZEME.fragments.BrandIdValueHelpRev", this);
			}

			jQuery.sap.syncStyleClass("sapUiSizeCompact", oView, this._BrandIdValueHelpRev);
			this._BrandIdValueHelpRev.open();

			var BrandIdAraDialogModel = new sap.ui.model.json.JSONModel();
			BrandIdAraDialogModel.setData({
				filterData: {
					BrandId: "",
					BrandDescr: ""
				},
				items: []
			});

			this._BrandIdValueHelpRev.setModel(BrandIdAraDialogModel);

		},

		handleBrandIdAraRev: function () {

			sap.ui.core.BusyIndicator.show();
			var oModelBrandIdArama = this._BrandIdValueHelpRev.getModel();
			var oDataBrandIdArama = oModelBrandIdArama.getData();
			var aFilters = [];

			if (oDataBrandIdArama.filterData.BrandId) {
				aFilters.push(new sap.ui.model.Filter("BrandId", sap.ui.model.FilterOperator.Contains, oDataBrandIdArama.filterData.BrandId));
			}
			if (oDataBrandIdArama.filterData.BrandDescr) {
				aFilters.push(new sap.ui.model.Filter("BrandDescr", sap.ui.model.FilterOperator.Contains, oDataBrandIdArama.filterData.BrandDescr));
			}

			this.getBrandIdDataRev(aFilters);

		},

		getBrandIdDataRev: function (filters) {
			var that = this;
			getBrandIdSH = [];
			var oDataModel = this.getOwnerComponent().getModel();

			oDataModel.read("/ZbzrShBrandidSet", {
				success: mySuccessHandler,
				error: myErrorHandler,
				filters: filters
			});

			function mySuccessHandler(data, response) {
				getBrandIdSH = data.results;
				that.bindView();
				var dialogData = that._BrandIdValueHelpRev.getModel().getData();
				dialogData.items = getBrandIdSH;
				that._BrandIdValueHelpRev.getModel().refresh(true);

				sap.ui.core.BusyIndicator.hide();
			}

			function myErrorHandler(response) {
				MessageBox.error("Bir hata oluştu. Lütfen sistem yöneticiniz ile iletişime geçiniz.");
				sap.ui.core.BusyIndicator.hide();
			}
		},

		handleBrandIdSecRev: function (oEvent) {

			var eklenecekBrandId = oEvent.getSource().getBindingContext().getObject();
			this.getView().getModel("oViewModel").getData().taleOnay[TableIndex].BrandId = eklenecekBrandId.BrandId;
			this.getView().getModel("oViewModel").getData().taleOnay[TableIndex].BrandDescr = eklenecekBrandId.BrandDescr;
			this.getView().getModel("oViewModel").refresh(true);
			this._BrandIdValueHelpRev.destroy();

		},

		BrandIdValueHelpRevClose: function () {
			this._BrandIdValueHelpRev.destroy();
		},

		/*ExtwgValueHelpRev*/
		ExtwgValueHelpRev: function (oEvent) {
			var Index = oEvent.getSource().getParent().sId.split("row").length;
			var TalNo = oEvent.getSource().getParent().getCells()[0].mProperties.text;
			TableIndex = this.getView().getModel("oViewModel").getData().taleOnay.findIndex(x => x.Requestid === TalNo);
			this._ExtwgValueHelpRev = sap.ui.getCore().byId("ExtwgValueHelpRev");
			if (!this._ExtwgValueHelpRev) {
				this._ExtwgValueHelpRev = sap.ui.xmlfragment("app.ZBZR_MALZEME.fragments.ExtwgValueHelpRev", this);
			}

			jQuery.sap.syncStyleClass("sapUiSizeCompact", oView, this._ExtwgValueHelpRev);
			this._ExtwgValueHelpRev.open();

			var VtwegAraDialogModel = new sap.ui.model.json.JSONModel();
			VtwegAraDialogModel.setData({
				filterData: {
					Extwg: "",
					Ewbez: ""
				},
				items: []
			});

			this._ExtwgValueHelpRev.setModel(VtwegAraDialogModel);

		},

		handleExtwgAraRev: function () {

			sap.ui.core.BusyIndicator.show();
			var oModelVtwegArama = this._ExtwgValueHelpRev.getModel();
			var oDataVtwegArama = oModelVtwegArama.getData();
			var aFilters = [];

			if (oDataVtwegArama.filterData.Extwg) {
				aFilters.push(new sap.ui.model.Filter("Extwg", sap.ui.model.FilterOperator.Contains, oDataVtwegArama.filterData.Extwg));
			}
			if (oDataVtwegArama.filterData.Ewbez) {
				aFilters.push(new sap.ui.model.Filter("Ewbez", sap.ui.model.FilterOperator.Contains, oDataVtwegArama.filterData.Ewbez));
			}

			this.getExtwgDataRev(aFilters);

		},

		getExtwgDataRev: function (filters) {
			var that = this;
			getExtwgSH = [];
			var oDataModel = this.getOwnerComponent().getModel();

			oDataModel.read("/ZbzrShExtwgSet", {
				success: mySuccessHandler,
				error: myErrorHandler,
				filters: filters
			});

			function mySuccessHandler(data, response) {
				getExtwgSH = data.results;
				that.bindView();
				var dialogData = that._ExtwgValueHelpRev.getModel().getData();
				dialogData.items = getExtwgSH;
				that._ExtwgValueHelpRev.getModel().refresh(true);

				sap.ui.core.BusyIndicator.hide();
			}

			function myErrorHandler(response) {
				MessageBox.error("Bir hata oluştu. Lütfen sistem yöneticiniz ile iletişime geçiniz.");
				sap.ui.core.BusyIndicator.hide();
			}
		},

		handleExtwgSecRev: function (oEvent) {

			var eklenecekExtwg = oEvent.getSource().getBindingContext().getObject();
			this.getView().getModel("oViewModel").getData().taleOnay[TableIndex].Extwg = eklenecekExtwg.Extwg + "-" + eklenecekExtwg.Ewbez;
			this.getView().getModel("oViewModel").refresh(true);
			this._ExtwgValueHelpRev.destroy();

		},

		ExtwgValueHelpRevClose: function () {
			this._ExtwgValueHelpRev.destroy();
		},

		/*TempbValueHelp Rev*/
		TempbValueHelpRev: function (oEvent) {
			var Index = oEvent.getSource().getParent().sId.split("row").length;
			var TalNo = oEvent.getSource().getParent().getCells()[0].mProperties.text;
			TableIndex = this.getView().getModel("oViewModel").getData().taleOnay.findIndex(x => x.Requestid === TalNo);
			this._TempbValueHelpRev = sap.ui.getCore().byId("TempbValueHelpRev");
			if (!this._TempbValueHelpRev) {
				this._TempbValueHelpRev = sap.ui.xmlfragment("app.ZBZR_MALZEME.fragments.TempbValueHelpRev", this);
			}

			jQuery.sap.syncStyleClass("sapUiSizeCompact", oView, this._TempbValueHelpRev);
			this._TempbValueHelpRev.open();

			var VtwegAraDialogModel = new sap.ui.model.json.JSONModel();
			VtwegAraDialogModel.setData({
				filterData: {
					Tempb: "",
					Tbtxt: ""
				},
				items: []
			});

			this._TempbValueHelpRev.setModel(VtwegAraDialogModel);

		},

		handleTempbAraRev: function () {

			sap.ui.core.BusyIndicator.show();
			var oModelVtwegArama = this._TempbValueHelpRev.getModel();
			var oDataVtwegArama = oModelVtwegArama.getData();
			var aFilters = [];

			if (oDataVtwegArama.filterData.Tempb) {
				aFilters.push(new sap.ui.model.Filter("Tempb", sap.ui.model.FilterOperator.Contains, oDataVtwegArama.filterData.Tempb));
			}
			if (oDataVtwegArama.filterData.Tbtxt) {
				aFilters.push(new sap.ui.model.Filter("Tbtxt", sap.ui.model.FilterOperator.Contains, oDataVtwegArama.filterData.Tbtxt));
			}

			this.getTempbDataRev(aFilters);

		},

		getTempbDataRev: function (filters) {
			var that = this;
			getTempbSH = [];
			var oDataModel = this.getOwnerComponent().getModel();

			oDataModel.read("/ZbzrShTempbSet", {
				success: mySuccessHandler,
				error: myErrorHandler,
				filters: filters
			});

			function mySuccessHandler(data, response) {
				getTempbSH = data.results;
				that.bindView();
				var dialogData = that._TempbValueHelpRev.getModel().getData();
				dialogData.items = getTempbSH;
				that._TempbValueHelpRev.getModel().refresh(true);

				sap.ui.core.BusyIndicator.hide();
			}

			function myErrorHandler(response) {
				MessageBox.error("Bir hata oluştu. Lütfen sistem yöneticiniz ile iletişime geçiniz.");
				sap.ui.core.BusyIndicator.hide();
			}
		},

		handleTempbSecRev: function (oEvent) {

			var eklenecekTempb = oEvent.getSource().getBindingContext().getObject();
			this.getView().getModel("oViewModel").getData().taleOnay[TableIndex].Tempb = eklenecekTempb.Tempb;
			this.getView().getModel("oViewModel").refresh(true);
			this._TempbValueHelpRev.destroy();

		},

		TempbValueHelpRevClose: function () {
			this._TempbValueHelpRev.destroy();
		},

		/*ZPergroupValueHelpRev*/
		ZPergroupValueHelpRev: function (oEvent) {
			var Index = oEvent.getSource().getParent().sId.split("row").length;
			var TalNo = oEvent.getSource().getParent().getCells()[0].mProperties.text;
			TableIndex = this.getView().getModel("oViewModel").getData().taleOnay.findIndex(x => x.Requestid === TalNo);
			this._ZPergroupValueHelpRev = sap.ui.getCore().byId("ZPergroupValueHelpRev");
			if (!this._ZPergroupValueHelpRev) {
				this._ZPergroupValueHelpRev = sap.ui.xmlfragment("app.ZBZR_MALZEME.fragments.ZPergroupValueHelpRev", this);
			}

			jQuery.sap.syncStyleClass("sapUiSizeCompact", oView, this._ZPergroupValueHelpRev);
			this._ZPergroupValueHelpRev.open();

			var VtwegAraDialogModel = new sap.ui.model.json.JSONModel();
			VtwegAraDialogModel.setData({
				filterData: {
					Class: "",
					Kschg: ""
				},
				items: []
			});

			this._ZPergroupValueHelpRev.setModel(VtwegAraDialogModel);

		},

		handleClassAraRev: function () {

			sap.ui.core.BusyIndicator.show();
			var oModelVtwegArama = this._ZPergroupValueHelpRev.getModel();
			var oDataVtwegArama = oModelVtwegArama.getData();
			var aFilters = [];

			if (oDataVtwegArama.filterData.Class) {
				aFilters.push(new sap.ui.model.Filter("Class", sap.ui.model.FilterOperator.Contains, oDataVtwegArama.filterData.Class));
			}
			if (oDataVtwegArama.filterData.Kschg) {
				aFilters.push(new sap.ui.model.Filter("Kschg", sap.ui.model.FilterOperator.Contains, oDataVtwegArama.filterData.Kschg));
			}
			if (Sirket === "2900") {
				this.getClassDataRev1(aFilters);
			} else {
				this.getClassDataRev(aFilters);
			}

		},

		getClassDataRev: function (filters) {
			var that = this;
			getClassSH = [];
			var oDataModel = this.getOwnerComponent().getModel();

			oDataModel.read("/ZbzrShPergrpSet", {
				success: mySuccessHandler,
				error: myErrorHandler,
				filters: filters
			});

			function mySuccessHandler(data, response) {
				getClassSH = data.results;
				that.bindView();
				var dialogData = that._ZPergroupValueHelpRev.getModel().getData();
				dialogData.items = getClassSH;
				that._ZPergroupValueHelpRev.getModel().refresh(true);

				sap.ui.core.BusyIndicator.hide();
			}

			function myErrorHandler(response) {
				MessageBox.error("Bir hata oluştu. Lütfen sistem yöneticiniz ile iletişime geçiniz.");
				sap.ui.core.BusyIndicator.hide();
			}
		},
		getClassDataRev1: function (filters) {
			var that = this;
			getClassSH = [];
			var oDataModel = this.getOwnerComponent().getModel();

			oDataModel.read("/ZbzrShPergrp1Set", {
				success: mySuccessHandler,
				error: myErrorHandler,
				filters: filters
			});

			function mySuccessHandler(data, response) {
				getClassSH = data.results;
				that.bindView();
				var dialogData = that._ZPergroupValueHelpRev.getModel().getData();
				dialogData.items = getClassSH;
				that._ZPergroupValueHelpRev.getModel().refresh(true);

				sap.ui.core.BusyIndicator.hide();
			}

			function myErrorHandler(response) {
				MessageBox.error("Bir hata oluştu. Lütfen sistem yöneticiniz ile iletişime geçiniz.");
				sap.ui.core.BusyIndicator.hide();
			}
		},

		handleClassSecRev: function (oEvent) {

			var eklenecekClass = oEvent.getSource().getBindingContext().getObject();
			//	this.getView().getModel("FormModel").getData().RequestItems[0].ZPergroupAd = eklenecekClass.Kschg;
			if (Sirket === "2900") {
				this.getView().getModel("oViewModel").getData().taleOnay[TableIndex].ZPergroup1 = eklenecekClass.Class;
			} else {
				this.getView().getModel("oViewModel").getData().taleOnay[TableIndex].ZPergroup = eklenecekClass.Class;
			}
			this.getView().getModel("oViewModel").refresh(true);
			this._ZPergroupValueHelpRev.destroy();

		},

		ZPergroupValueHelpRevClose: function () {
			this._ZPergroupValueHelpRev.destroy();
		},
	});
});