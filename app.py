from flask import Flask, jsonify, request, render_template, redirect, url_for, session
import mysql.connector
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)
app.secret_key = 'your_secret_key'  # Set a secret key for session management

# Database connection


def get_db_connection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST", "localhost"),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASS", "root_password"),
        database=os.getenv("DB_NAME", "user_db"),
        port=int(os.getenv("DB_PORT", 3306))
    )


# User Registration
@app.route('/')
def index():
    return render_template('home.html')

@app.route('/register')
def renderregister():
    return render_template('register.html')

@app.route('/register', methods=['POST'])
def register():
    try:
        company_name = request.form['company']
        representative_fname = request.form['name']
        representative_lname = request.form['lname']
        email = request.form['email']
        phone = request.form['phone']
        gst_no = request.form['edittext']
        password = request.form['psw']

        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute('''INSERT INTO user (company_name, representative_fname, representative_lname, email, phone, gst_no, password)
                          VALUES (%s, %s, %s, %s, %s, %s, %s)''',
                       (company_name, representative_fname, representative_lname, email, phone, gst_no, password))

        connection.commit()
        cursor.close()
        connection.close()

        return jsonify({'message': 'Registration successful!', 'redirect': '/home'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Login Route
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        # Check for admin credentials
        if email == 'akshat@gmail.com' and password == 'kairavy_patel':
            session['admin_logged_in'] = True
            return redirect(url_for('admin_panel'))

        # Check in the database for user credentials
        try:
            connection = get_db_connection()
            cursor = connection.cursor(dictionary=True)
            cursor.execute('SELECT * FROM user WHERE email = %s', (email,))
            user = cursor.fetchone()

            if user and password == user['password']:
                session['user_logged_in'] = True
                session['user_email'] = user['email']  # Store the user's email in the session
                return redirect(url_for('home'))  # Redirect to user home page
            else:
                # return 'Invalid credentials'
                return render_template('login.html',error="invalid email or password"),401

        except Exception as e:
            return str(e), 500

        finally:
            cursor.close()
            connection.close()
    return render_template('login.html')

# Admin Panel Route
@app.route('/admin_panel')
def admin_panel():
    if not session.get('admin_logged_in'):
        return redirect(url_for('login'))
    return render_template('admin_index.html')

# Admin User Management
@app.route('/users', methods=['GET'])
def users():
    return render_template('admin_users.html')

@app.route('/api/users', methods=['GET'])
def get_users():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT id, company_name, representative_fname, representative_lname, email, phone, gst_no FROM user')
    users = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(users)

@app.route('/api/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM user WHERE id = %s', (user_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'message': 'User  deleted successfully'})

# Admin Inquiries Management
@app.route('/inquiries', methods=['GET'])
def inquiries():
    return render_template('admin_enquiries.html')

@app.route('/api/inquiries', methods=['GET'])
def get_inquiries():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT id, name, email, message FROM inquiries')
    inquiries = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(inquiries)

@app.route('/api/inquiries/<int:inquiry_id>', methods=['DELETE'])
def delete_inquiry(inquiry_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM inquiries WHERE id = %s', (inquiry_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'message': 'Inquiry deleted successfully'})

# Admin Orders Management
@app.route('/orders', methods=['GET'])
def orders():
    return render_template('admin_orders.html')

@app.route('/api/orders', methods=['GET'])
def get_orders():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT id, customer_name, customer_email, customer_address, product_name, quantity, created_at, status FROM orders')
    orders = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(orders)

@app.route('/api/orders/<int:order_id>/status', methods=['PUT'])
def update_order_status(order_id):
    new_status = request.json.get('status')
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('UPDATE orders SET status = %s WHERE id = %s', (new_status, order_id))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'message': 'Order status updated successfully'})

@app.route('/api/orders/<int:order_id>', methods=['DELETE'])
def delete_order(order_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM orders WHERE id = %s', (order_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'message': 'Order deleted successfully'})

# User Home Page
@app.route('/home')
def home():
    return render_template('home.html')

# Product Page
@app.route('/product_page')
def product_page():
    return render_template('product_page.html')

# Inquiry Submission
@app.route('/submit_inquiry', methods=['POST'])
def submit_inquiry():
    try:
        name = request.form['name']
        email = request.form['email']
        phone = request.form['phone']
        category = request.form['category']
        message = request.form['message']

        connection = get_db_connection()
        cursor = connection.cursor()
        insert_query = """INSERT INTO inquiries (name, email, phone, category, message) 
                          VALUES (%s, %s, %s, %s, %s)"""
        cursor.execute(insert_query, (name, email, phone, category, message))
        connection.commit()

        return jsonify({"status": "success", "message": "Inquiry submitted successfully!"}), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

# Place Order
@app.route('/place_order', methods=['POST'])
def place_order():
    try:
        order_data = request.get_json()
        customer_name = order_data['customerName']
        customer_email = order_data['customerEmail']
        customer_address = order_data['customerAddress']
        cart = order_data['cart']

        connection = get_db_connection()
        cursor = connection.cursor()

        for item in cart:
            insert_order_query = """INSERT INTO orders (customer_name, customer_email, customer_address, product_name, quantity) 
                                    VALUES (%s, %s, %s, %s, %s)"""
            cursor.execute(insert_order_query, (customer_name, customer_email, customer_address, item['name'], item['quantity']))

        connection.commit()
        return jsonify({"status": "success", "message": "Order placed successfully!"}), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

# Customer Order Page
@app.route('/customer_order')
def customer_order():
    user_email = session.get('user_email')  # Get the user's email from the session
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM orders WHERE customer_email = %s', (user_email,))  # Filter by user email
    orders = cursor.fetchall()
    cursor.close()
    conn.close()
    return render_template('customer_order.html', orders=orders)

# Cancel Order
@app.route('/cancel/<int:order_id>', methods=['POST'])
def cancel_order(order_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('UPDATE orders SET status = %s WHERE id = %s', ('Cancelled', order_id))
    conn.commit()
    cursor.close()
    conn.close()
    return '', 204  # No content response

# Logout Route
@app.route('/logout')
def logout():
    session.pop('admin_logged_in', None)
    session.pop('user_logged_in', None)
    return redirect(url_for('login'))

# Additional Pages
@app.route('/blogs')
def blogs():
    return render_template('blogs.html')

@app.route('/contact_us')
def contact_us():
    return render_template('contact_us.html')

@app.route('/bakery')
def bakery():
    return render_template('bakery.html')

@app.route('/beverage')
def beverage():
    return render_template('beverage.html')

@app.route('/dairy')
def dairy():
    return render_template('dairy.html')

@app.route('/pharma')
def pharma():
    return render_template('pharma.html')

@app.route('/flavadew')
def flavadew():
    return render_template('flavadew.html')

@app.route('/flavaseal')
def flavaseal():
    return render_template('flavaseal.html')

@app.route('/body_care')
def body_care():
    return render_template('body_care.html')

@app.route('/fine_frag')
def fine_frag():
    return render_template('fine_frag.html')

@app.route('/home_care')
def home_care():
    return render_template('home_care.html')

@app.route('/incense_stick')
def incense_stick():
    return render_template('incense_stick.html')

@app.route('/color_main_page')
def color_main_page():
    return render_template('color_main_page.html')

@app.route('/cooking')
def cooking():
    return render_template('cooking.html')

@app.route('/cosmetics')
def cosmetics():
    return render_template('cosmetics.html')

@app.route('/flavour_main_page')
def flavour_main_page():
    return render_template('flavour_main_page.html')

@app.route('/fragrance_main_page')
def fragrance_main_page():
    return render_template('fragrance_main_page.html')

@app.route('/medicine')
def medicine():
    return render_template('medicine.html')

if __name__ == "__main__":
    app.run(debug=True)