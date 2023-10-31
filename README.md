# Beyond the Books Project

**Original Repository Link: [OpenSourceTB](https://github.com/RazielGelo/OpenSourceTB)**

# Overview

We thought of making an open source website for our project in CSTP 1206 that will be helpful to everyone specially with the students, with the help of contributors which we can call educators that will share their knowledge by adding and updating virtual books that will be available to everyone. An open source website unlike static paper textbooks, the open source textbook reflects users' experience and opinions to always improve the knowledge of people all over the world. You can take a look at our documentation.

# Objective

To provide an integrated platform which is our website, where people who want to learn and gain knowledge that can be useful not only in their school life but also outside of it and people who love to share their knowledge but are unable because of the lack of platforms that they can use and contribute freely. These virtual books are free for anyone to read, update and publish.

# Built with 
![Pug](https://img.shields.io/badge/Pug-FFF?style=for-the-badge&logo=pug&logoColor=A86454) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![SASS](https://img.shields.io/badge/SASS-hotpink.svg?style=for-the-badge&logo=SASS&logoColor=white) ![Bootstrap](https://img.shields.io/badge/bootstrap-%238511FA.svg?style=for-the-badge&logo=bootstrap&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white) 


# Project Structure Folder

<li>middleware: Contains the passport.js </li>
<li>prisma: Contains the database structure and its relationship </li>
<li>public: Contains all CSS, JS, and SASS </li>
<li>routes: Contains book.js, user.js, and index.js </li>
<li>views: Contains all design of the website in pug files</li>
<li>Files: .env: Contains secret codes such as database links </li>
<li>index.js: Contains codes that initializes the website and libraries </li>
<li>package.json: Contains scripts that's used to run the website and other package dependencies</li>

# How To Run

<li>Create a new folder and give a name</li>
<li>Open the CMD command and go to the folder</li>
<li>Type in "git clone https://github.com/RazielGelo/OpenSourceTB.git"</li>
<li>Go to the github folder</li>
<li>Type in "npm i"</li>
<li>Run the folder by type in "npm run dev"</li>


# Our Team

You can contact the Author in discord
- [Angelo Guerra](https://github.com/RazielGelo) 
- [Emil](https://github.com/emilsangil)
- [Clarissa Nicole Taswin](https://github.com/Nicole308)
- [Keisuke Kawataki](https://github.com/newliberties)
- [Inigo](https://github.com/inigomari)


**********************************
*********** USER STORY ***********
**********************************

-----------------------------------------------------------------------------------------------------------------------
Login 
-----------------------------------------------------------------------------------------------------------------------
Login 1 		| As a user, I will received an error if the email doesn't exists
			| Display: Sorry, we can't find an account with this email address. Please try again or create a new account.
	
Login 2 		| As a user, I will received an error when password is incorrect
			| Display: Login Failed! Your password is incorrect. Please try again.
	
-----------------------------------------------------------------------------------------------------------------------
Registration
-----------------------------------------------------------------------------------------------------------------------

Registration 1 		| Happy Path
			| As a user, I can register for a new account by entering my FirstName, LastName, Birthdate, Email, Password and Password Confirmation. All are mandatory fields.
				Successful registration should display 
 				Congratulations, you've signed up successfully!
  				Start exploring by logging in!.
				Login Page should be displayed
	
Registration 2 		| As a user, I will received an error message if the Password is not equals to Password Confirmation
			| Display: Password did not match.
	
Registration 3 		| As a user, I will received a warning message if the email address is invalid
			| Display: You have entered an invalid email address. Please try again.
	
Registration 4 		| As a user, I will received an error message if password is < 8 characters
			| Display: Password must contain at least 8 characters.
	
Registration 5 		| As a user, I will received a warning message if any of the following fields are null (FirstName, LastName, Birthdate, Email, Password and Password Confirmation)
			| Display: “This field is required" if field is null
			| Display: “Please complete all required fields before proceeding”
	
Registration 6 		| As a user, I will received an error message if First Name or Last Name has only 1 character
			| Display
   				First Name must contain at least 2 characters.
   				Last Name must contain at least 2 characters.

Registration 7 		| As a user,  I should received an error message if birthdate is =< January 1, 1900
			| Display “Birthday should be less than date today”
	
Registration 8 		| Values in the registration page should not be removed when you encounter an error message
			| Expected Result: Error message should be displayed without refreshing the page
			| Actual Result: Field values in the registration page should still be displayed even if there is an error message. The user needs to re enter field values.

Registration 9
			| As a user, I will received an error if the email already exists
			| Display An account with email "email" already exists. If you remember your password, please log in.
			| Log in hyperlink to login page
	
Registration 10 	| As a user, I will received an error message if First Name or Last Name has numeric value
			| Display "Please enter a valid name"

-----------------------------------------------------------------------------------------------------------------------
Registration Successful Page
-----------------------------------------------------------------------------------------------------------------------

Registration Successful Page 1 		| As a user, who was able to successfully registered should be able to proceed with the login page
			| Successful registration should display 
   			| Congratulations, you've signed up successfully!
   			| Start exploring by logging in!.
        
-----------------------------------------------------------------------------------------------------------------------
Logout
-----------------------------------------------------------------------------------------------------------------------
Logout 1 		| As a login user, I am able to logout from my account.
   			| Display "Thank you for using OpenSource Textbook"
	
Logout 2  		| As a user who was successfully login should be able to see the Log out button from the dropdown menu under the My Dashboard
			| Display "Logout button under the dropdown menu"
	
-----------------------------------------------------------------------------------------------------------------------
User Account Dropdown Menu (Nice to Have)
-----------------------------------------------------------------------------------------------------------------------
User Account Menu 1 	| As a signed in user, I should be able to see my username from the upper right corner
			| Username will be displayed under the user account dropdown menu
	
User Account Menu 2 	| As a signed in user, I should be able to see the following in the dropdown menu list User Profile, My Dashboard and Logout
			| Display the following list User Profile, My Dashboard and Logout 
	
-----------------------------------------------------------------------------------------------------------------------
User Profile Page
-----------------------------------------------------------------------------------------------------------------------
User Profile 1 		| As a signed in user, when I access the User Profile I should be able to see the following fields and details correctly
			| Edit Profile button and Change Password button should be displayed
			| Display the following fields
				* Username (*not editable)
				* Email (*not editable)
				* First Name
				* Last Name
				* Birthday (DD/MM/YYYY) 

User Profile 2 		| As a signed in user, in the User Profile page I should be able to update each field independently when I click the Edit Profile
			| The following fields should have an (Edit) button
				* First Name
				* Last Name
				* Birthday (DD/MM/YYYY) 
				* The value for the First Name and Last Name should be retained when Edit Profile button is selected

User Profile 3 		| As a signed in user, when I click the Edit Profile button, I should be able to see the First Name, Last Name and Birthday
			| The following fields should be displayed
				* First Name
				* Last Name
				* Birthday (DD/MM/YYYY) 
				* The value for the First Name and Last Name should be retained when Edit Profile button is clicked
	
User Profile 4 		| As a signed in user, when I click Change Password button I should be able to update the password
			| The following field should be displayed
				* Current Password
				* New Password
				* Confirm Password
	
User Profile 5 		| In the Change Password page, when the user tries to update the Password and the New Password doesn’t match with the Confirm Password field
			| Display: Password do not match
	
User Profile 6 		| In the Change Password page, when the New Password and Confirm Password fields are null when user tries to update the Current Password 
			| Display: “Password must have 8 characters"
	
(Nice to Have) 		| In the User Profile page, New Password and Confirm Password field should be disabled if the Current Password is not updated
			| New Password and Confirm Password field should be visible but not editable
	
-----------------------------------------------------------------------------------------------------------------------
View Book as a guest
-----------------------------------------------------------------------------------------------------------------------
View Book 1 		| As a guest, who did not logged in when I View Book I should be able to see the book details
			| The following should be displayed
				* Book Title
				* Authors username
				* Genre
				* Description 
				* The sidebar should be displayed with the Book Chapters

View Book 2 		| As a guest, when I View Book and open a Book Chapter
			| The following should be displayed
				* Book Title
				* Authors username
				* Genre
				* Description 
				* Chapter Name field - disabled
				* Page Number field - disabled
				* Current Page Update textarea - disabled
				* Back button
				* The sidebar should display the Book Chapter and the Update Existing Page button
	
View Book 3 		| As a guest, who did not logged in when I View Book and click the Update Existing Page button it should direct me to Log in Page
			| Login Page should be displayed
	
-----------------------------------------------------------------------------------------------------------------------
View Book as a logged in user but not as the Author
-----------------------------------------------------------------------------------------------------------------------
View Book as not the Author 1 	| As a signed in user, when I View Book and open any Book Chapter I should be able to see Update Existing Page button
			| Update Existing Page should be displayed
	
-----------------------------------------------------------------------------------------------------------------------
View Book as a logged in user as the Author
-----------------------------------------------------------------------------------------------------------------------
View Book as Author 1 	| As a signed in user, when I View Book I should be able to see the following buttons
			| Modify Book and Delete Book should be displayed

View Book as Author 2 	| As a signed in user, when I View Book I should be able to see the following buttons
			| Modify Book and Delete Book should be displayed

-----------------------------------------------------------------------------------------------------------------------
Create New Book
-----------------------------------------------------------------------------------------------------------------------
Create New Book 1 	| As a signed in user I should be able to add a new book. 
			| New Book should be added

Create New Book 2 	| Description field has a limit of 200 characters 
			| Display Description field has a max limit of 200 characters
	
-----------------------------------------------------------------------------------------------------------------------
Add New Page
-----------------------------------------------------------------------------------------------------------------------
Add New Page 1 		| As a logged in user, when I View Book the Add Page should be displayed
			| The following fields should be displayed
				* Chapter Name field - mandatory field
				* Page Number field - mandatory field
				* Content textarea field - mandatory field
	
Add New Page 2 		| As a logged in user, when I click Add Page button with a null field I should get a warning message
				* The following warning message should be displayed specifically 
				* If Chapter Name is null display “Chapter name should not be empty”
				* If Page Number field is null display “Page number should not be empty
				* If Content textarea field is null display “Page should not be empty”
	
Add New Page 3 		| As a logged in user, when I create a new page I should be able to get a warning message if the Book Title is more than 60 characters
			| Display “Chapter name should not exceed 60 characters”
	
-----------------------------------------------------------------------------------------------------------------------
Update Existing Page
-----------------------------------------------------------------------------------------------------------------------
Update Existing Page 1 	| As a signed in user, when I View Book and open book chapter the Update Existing Page should be displayed
			| The following warning message should be displayed 
				* Chapter Name should not  be editable if not the Book Author 
				* Page Number should not  be editable if not the Book Author 
				* Content textarea field
	
-----------------------------------------------------------------------------------------------------------------------
Delete Existing Page 
-----------------------------------------------------------------------------------------------------------------------
Delete Existing Page 1 	| As the author of the book when I log in and open the book chapter I should be able to see the Delete Existing Page button
			| Delete Existing Page button should be displayed
	
Delete Existing Page 2 	| As not the author of the book when I log in and open the book chapter I should not be able to see the Delete Existing Page button
			| Delete Existing Page button should not be displayed
	
Delete Existing Page 3 	| As a guest when I am not log in and open the book chapter I should not be able to see the Delete Existing Page button
			| Delete Existing Page button should not be displayed

-----------------------------------------------------------------------------------------------------------------------
Delete Book
-----------------------------------------------------------------------------------------------------------------------
Delete Book 1 		| As the author of the book when I log in and open the book I should be able to see the Delete book button
			| Delete Book button is displayed

Delete Book 2 		| As not the author of the book when I log in and open the book I should not be able to see the Delete book button
			| Delete Book button should not be displayed
	
Delete Book 3 		| As a guest when I log in and open the book I should not be able to see the Delete book button
			| Delete Book button should not be displayed
	
-----------------------------------------------------------------------------------------------------------------------
Formatting Tool
-----------------------------------------------------------------------------------------------------------------------
Formatting Tool 1 	| As a signed in user, if I want to Add or Update Existing Page the content should only accept 1600 characters long
			| Display: “Can only accept 1600 characters long”
	
-----------------------------------------------------------------------------------------------------------------------
Collaboration Tool
-----------------------------------------------------------------------------------------------------------------------
Collaboration Tool 1 	| As the author of the book I should be able to see if there are any pending updates for each chapter
			| Display “1 pending approval request”
	
-----------------------------------------------------------------------------------------------------------------------
Add New Genre
-----------------------------------------------------------------------------------------------------------------------
Add New Genre 1 	| In Add Genre page, when a special character is entered other than “-” it should display a warning message
			| Display: “Genre can only contain letters, spaces, and dashes"

Add New Genre 2 	| In Add Genre page, when you add a Genre name starting with a small letter it will automatically generate the first letter as a capital letter
			| First letter will be capital for the Genre

-----------------------------------------------------------------------------------------------------------------------
Resolved Conflict
-----------------------------------------------------------------------------------------------------------------------
Resolved Conflict 1 	| When two users are trying to update the same existing page but the page was updated by the author  
			| Resolved Conflict page will be displayed for the user who are trying to update the page and the updated page will be displayed. 
      
-----------------------------------------------------------------------------------------------------------------------
Roadmap
-----------------------------------------------------------------------------------------------------------------------

**************************************************************
*********** NICE TO HAVE (For future Enhancements) ***********
**************************************************************

To have a page for the Genre. List of genres will be displayed. 
	If you click a specific genre then you will be directed to a new page that will display all of the books for that specific genre only.

To have a switch button (ON/OFF) on Authors profile to let the other users to update the book.
For example for Book A the author doesn’t want the other users to update the book then he will just need to set the button to “ OFF” so that the following buttons will not be displayed on the other users: Add New Page, Update Existing Page, Delete Page. 

As a user, I will be locked for 30 mins after 5 failed attempts
			| Display: Your account is blocked for 30 minutes due to reaching the maximum 5 failed login attempts.

As a user,  I should received an error message if age is less than 13 years old
			| Display Minimum age required is 13 and above
				today = date.today()
				age = today.year - birthDate.year - ((today.month, today.day) < (birthDate.month, birthDate.day))
The only  special characters - . , '  accepted in First Name and Last Name
Special Characters accepted
- dash
. period
, comma
' apostrophe
**************************************************************
************************ KNOWN ISSUES ************************
**************************************************************

Not critical or low priority bugs as of Deployment 03.04.2022
-----------------------------------------------------------------------------------------------------------------------
Registration
-----------------------------------------------------------------------------------------------------------------------
Issue 0001		| Description: Birth year should only accept 4 digits in the input field
        		| Low Priority: can be handled by the validation error

