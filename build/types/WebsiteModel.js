"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInitialState = exports.WebsiteModelKeys = exports.SitePropertyModelKey = void 0;
var SitePropertyModelKey;
(function (SitePropertyModelKey) {
    SitePropertyModelKey["Title"] = "title";
    SitePropertyModelKey["Text"] = "text";
    SitePropertyModelKey["MetaDescription"] = "metaDescription";
    SitePropertyModelKey["MetaTitle"] = "metaTitle";
    SitePropertyModelKey["ImageUrl"] = "imageUrl";
    SitePropertyModelKey["SecondaryDescription"] = "secondaryDescription";
    SitePropertyModelKey["Email"] = "email";
    SitePropertyModelKey["Address"] = "address";
    SitePropertyModelKey["CompanyName"] = "companyName";
    SitePropertyModelKey["PhoneNumber"] = "phoneNumber";
})(SitePropertyModelKey || (exports.SitePropertyModelKey = SitePropertyModelKey = {}));
var WebsiteModelKeys;
(function (WebsiteModelKeys) {
    WebsiteModelKeys["MetaTitle"] = "metaTitle";
    WebsiteModelKeys["Url"] = "url";
    WebsiteModelKeys["Description"] = "description";
    WebsiteModelKeys["PrimaryColor"] = "primaryColor";
    WebsiteModelKeys["SecondaryColor"] = "secondaryColor";
    WebsiteModelKeys["Email"] = "email";
    WebsiteModelKeys["Address"] = "address";
    WebsiteModelKeys["ServiceDescription"] = "serviceDescription";
    WebsiteModelKeys["AboutUs"] = "aboutUs";
    WebsiteModelKeys["Bodys"] = "bodyTexts";
    WebsiteModelKeys["Services"] = "services";
    WebsiteModelKeys["ContactInfo"] = "contactInfo";
})(WebsiteModelKeys || (exports.WebsiteModelKeys = WebsiteModelKeys = {}));
const generateInitialState = () => ({
    url: "www.example.com",
    title: "Städhjälp Malmö",
    metaTitle: "Meta Title",
    description: "Beskrivning",
    primaryColor: "#145bd7",
    secondaryColor: "#f8bd3b",
    aboutUs: "Om oss",
    bodyTexts: Array(3).fill({ title: "Title", text: "Change this" }),
    services: Array(3).fill({
        title: "Service Title",
        text: "Service info",
        metaTitle: "Meta title",
        metaDescription: "meta description",
        imageUrl: "url",
    }),
    contactInfo: {
        email: "example@example.com",
        address: "skirtvägen 13, 213 70 malmö",
        companyName: "Media Partners AB",
        phoneNumber: "0731234545",
    },
});
exports.generateInitialState = generateInitialState;
