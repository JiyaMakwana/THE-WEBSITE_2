from . import app
from flask import render_template, jsonify
from .database import get_db_connection

@app.route('/users')
def users():
    return render_template('users.html')

@app.route('/api/users', methods=['GET'])
def get_users():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM user')
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

@app.route('/orders', methods=['GET'])
def orders():
    return render_template('admin_orders.html')

@app.route('/api/orders', methods=['GET'])
def get_orders():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT id, customer_name, customer_email, customer_address, product_name, quantity, created_at FROM orders')
    orders = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(orders)

@app.route('/api/orders/<int:order_id>', methods=['DELETE'])
def delete_order(order_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM orders WHERE id = %s', (order_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'message': 'Order deleted successfully'})

if __name__ == '__main__':
    app.run(debug=True)