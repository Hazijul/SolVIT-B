package models

import "time"

type Gender string

const (
	Male   Gender = "Male"
	Female Gender = "Female"
)

type UserType string

const (
	Buyer  UserType = "Buyer"
	Seller UserType = "Seller"
	Admin  UserType = "Admin"
)

type Users struct {
	ID            uint     `gorm:"primaryKey"`
	Full_Name     string   `json:"Full_Name" gorm:"not null"`
	GenderInfo    Gender   `json:"GenderInfo"`
	ContactNumber string   `json:"ContactNumber" gorm:"not null"`
	BusinessName  string   `gorm:"not null" json:"business_name"`
	Email         string   `json:"Email" gorm:"not null;unique"`
	GSTNumber     string   `gorm:"unique;not null" json:"gst_number"`
	Password      string   `json:"Password"`
	Region        string   `json:"region"`
	User_type     UserType `json:"User_type"`
}

type ComplaintType string

const (
	Electricity ComplaintType = "electricity"
	WiFi        ComplaintType = "wifi"
	Hardware    ComplaintType = "hardware"
	Others      ComplaintType = "others"
)

type Complaint struct {
	ComplaintID    uint          `gorm:"primaryKey" json:"complaint_id"`
	StudentID      uint          `gorm:"" json:"student_id"`
	RegNo          string        `gorm:"not null" json:"reg_no"` // Foreign key to Student
	ComplaintType  ComplaintType `gorm:"type:varchar(20);not null" json:"complaint_type"`
	Description    string        `gorm:"not null" json:"description"`
	Status         bool          `gorm:"not null;default:false" json:"status"` // false = pending, true = resolved
	Room           string        `gorm:"not null" json:"room"`
	HostelName     string        `gorm:"not null" json:"hostel_name"`
	ContactDetails string        `gorm:"not null" json:"contact_details"`
}
type Inventory struct {
	ProductID    uint      `gorm:"primaryKey" json:"product_id"`
	AdminID      uint      `gorm:"not null" json:"admin_id"`
	BusinessName string    `gorm:"not null" json:"business_name"`
	GSTNumber    string    `gorm:"unique;not null" json:"gst_number"`
	ProductName  string    `gorm:"not null" json:"product_name"`
	Price        uint      `gorm:"not null" json:"price"`
	Time         time.Time `gorm:"autoCreateTime" json:"time"`
	Quantity     int       `gorm:"not null" json:"quantity"`
	TotalPrice   int       `gorm:"not null" json:"total_price"`
}

// Invoice struct
type Invoice struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Name        string    `gorm:"not null" json:"name"`
	Time        time.Time `gorm:"autoCreateTime" json:"time"` // Auto-generates timestamp
	ProductName string    `gorm:"not null" json:"product_name"`
	BuyerEmail  string    `gorm:"not null" json:"buyer_email"`
	PDFPath     string    `gorm:"not null" json:"pdf_path"` // Path to the stored PDF file
}
