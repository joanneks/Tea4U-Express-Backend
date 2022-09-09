# Tea4U - Backend Web Application + Restful API

# **Summary**
<div style="height:20px"></div>
This is a restful API and backend web application meant for the admins of the ecommerce web application [Tea4U](https://tea4u-tgc18.netlify.app/). Please visit the github repository for Tea4U's frontend web application [here](https://github.com/joanneks/tea4u-react) for more details on the project.

<div style="height:20px"></div>

## **Test Accounts**:
1. Tea4U-Express-Backend : Access the admin panel [here](https://tea4u-express-tgc18.herokuapp.com/).
    - Email: admin@tea4u.com
    - Password: Tadmin1!


<div style="height:20px"></div>

## **Structure**
<div style="height:20px"></div>

![Structure Express](/readme/structureExpress.png)
<div style="height:20px"></div>

## **Database design and Structure**
<div style="height:20px"></div>

### **Entity Relationship Diagram (ERD)**
<div style="height:20px"></div>

![ERD](/readme/erd.png)
<div style="height:20px"></div>

### **Logical Schema:**
<div style="height:20px"></div>

![Logical Schema](/readme/logicalSchema.png)
<div style="height:20px"></div>


## **Technologies Used**
<div style="height:20px"></div>

### **_Backend Technologies_**
1. [Express & NodeJS](https://fonts.google.com/) as framework for API endpoints and hbs
2. [db-migrate](https://db-migrate.readthedocs.io/en/latest/API/SQL/) for database migration
3. [Bookshelf](https://bookshelfjs.org/index.html) for accessing database
4. [cors middleware](https://expressjs.com/en/resources/middleware/cors.html) to enable CORS
5. [dotenv](https://www.npmjs.com/package/dotenv) for .env file containing environment variables
6. [Caolan forms](https://github.com/caolan/forms) for form creation and validation
6. [MomentJS](https://momentjs.com/docs/) for date and time display
7. [express-session]() to manage sessions
9. [express-flash] to display flash messages
10. [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) for user authentication on front-end
11. [hbs](https://www.npmjs.com/package/hbs) to generate template
12. [handlebarhelpers](https://handlebarsjs.com/guide/builtin-helpers.html)
13. [Cloudinary](https://cloudinary.com/documentation/image_video_and_file_upload) for image upload
14. [Bootstrap](https://getbootstrap.com/docs/5.2/getting-started/introduction/) for HTML, CSS Styling
    - button, navbar, tabs
<div style="height:20px"></div>

## **Environment variables**
<div style="background:#f5f2ee;border-radius:10px;padding:10px;margin:10px 0px 0px 20px">
DB_DRIVER=
</br>
DB_USER=
</br>
DB_PASSWORD=
</br>
DB_DATABASE=
</br>
DB_HOST=
</br>
CLOUDINARY_NAME=
</br>
CLOUDINARY_API_KEY=
</br>
CLOUDINARY_API_SECRET=
</br>
CLOUDINARY_UPLOAD_PRESET=
</br>
SESSION_SECRET=
</br>
STRIPE_PUBLISHABLE_KEY=
</br>
STRIPE_SECRET_KEY=
</br>
STRIPE_SUCCESS_URL=
</br>
STRIPE_CANCEL_URL=
</br>
STRIPE_ENDPOINT_SECRET=
</br>
TOKEN_SECRET=
</br>
REFRESH_TOKEN_SECRET=</div>
<div style="height:40px"></div>
