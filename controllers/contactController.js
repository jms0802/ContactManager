const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

// @desc Get all contacts
// @route GET /contacts

const getAllContacts = asyncHandler(async (req, res) => {
  // 전체 연락처 보기
  const contacts = await Contact.find();
  res.render("index", {contacts:contacts});
});

// View add Contact form
// GET /contacts/add

const addContactForm = (req, res) => {
    res.render("add");
}

// @desc Create a contact
// @route POST /contacts
const createContact = asyncHandler(async (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).send("필수값이 입력되지 않았습니다.");
  }

  const contact = await Contact.create({
    name,
    email, 
    phone,
  });
  res.redirect("/contacts");
});

// @desc Get contact
// @route GET /contacts/:id
const getContact = asyncHandler(async (req, res) => {
  // 연락처 상세 보기
  const contact = await Contact.findById(req.params.id);
  res.render("update", {contact:contact});
});

// @desc Update contact
// @route PUT /contacts/:id
const updateContact = asyncHandler(async (req, res) => {
  // 연락처 수정하기
  const id = req.params.id;
  const {name, email, phone} = req.body;
  const contact = await Contact.findById(id);
  if(!contact) {
    throw new Error("Contact not found.");
  }

  contact.name = name;
  contact.email = email;
  contact.phone = phone;
  contact.save();

  res.redirect("/contacts");
});

// @desc Delete contact
// @route DELETE /contacts/:id
const deleteContact = asyncHandler(async (req, res) => {
    const id = req.params.id;
    
    await Contact.findByIdAndDelete(id);
    res.redirect("/contacts");
});

module.exports = {
  getAllContacts,
  addContactForm,
  createContact,
  getContact,
  updateContact,
  deleteContact,
};
