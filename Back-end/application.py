from flask import Flask, request, jsonify
from flask import Flask, render_template, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql.expression import asc

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////home/ec2-user/backend/main.db'
db = SQLAlchemy(app)

from datetime import timedelta
from flask import make_response, request, current_app
from functools import update_wrapper

def crossdomain(origin=None, methods=None, headers=None,
                max_age=21600, attach_to_all=True,
                automatic_options=True):
    if methods is not None:
        methods = ', '.join(sorted(x.upper() for x in methods))
    if headers is not None and not isinstance(headers, basestring):
        headers = ', '.join(x.upper() for x in headers)
    if not isinstance(origin, basestring):
        origin = ', '.join(origin)
    if isinstance(max_age, timedelta):
        max_age = max_age.total_seconds()

    def get_methods():
        if methods is not None:
            return methods

        options_resp = current_app.make_default_options_response()
        return options_resp.headers['allow']

    def decorator(f):
        def wrapped_function(*args, **kwargs):
            if automatic_options and request.method == 'OPTIONS':
                resp = current_app.make_default_options_response()
            else:
                resp = make_response(f(*args, **kwargs))
            if not attach_to_all and request.method != 'OPTIONS':
                return resp

            h = resp.headers

            h['Access-Control-Allow-Origin'] = origin
            h['Access-Control-Allow-Methods'] = get_methods()
            h['Access-Control-Max-Age'] = str(max_age)
            if headers is not None:
                h['Access-Control-Allow-Headers'] = headers
            return resp

        f.provide_automatic_options = False
        return update_wrapper(wrapped_function, f)
    return decorator

class BikeRack(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    suburb = db.Column(db.String(250), nullable=False)
    address = db.Column(db.String(250), nullable=False)
    location = db.Column(db.String(250), nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    rack_type = db.Column(db.String(250), nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)

    def to_json(self):
        return {
            "id" : self.id,
            "suburb" : self.suburb,
            "address" : self.address,
            "location" : self.location,
            "capacity" : self.capacity,
            "rack_type" : self.rack_type,
            "latitude" : self.latitude,
            "longitude" : self.longitude
        }

class Meter(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    street = db.Column(db.String(250), nullable=False)
    suburb = db.Column(db.String(250), nullable=False)
    description = db.Column(db.String(250), nullable=False)
    bays = db.Column(db.Integer, nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)

    def to_json(self):
        return {
            "id" : self.id,
            "street" : self.street,
            "suburb" : self.suburb,
            "description" : self.description,
            "bays" : self.bays,
            "latitude" : self.latitude,
            "longitude" : self.longitude
        }

class Bubbler(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    suburb = db.Column(db.String(250), nullable=False)
    park_name = db.Column(db.String(250), nullable=False)
    item_type = db.Column(db.String(250), nullable=False)
    bays = db.Column(db.Integer, nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)

    def to_json(self):
        return {
            "id" : self.id,
            "suburb" : self.suburb,
            "park_name" : self.park_name,
            "item_type" : self.item_type,
            "bays" : self.bays,
            "latitude" : self.latitude,
            "longitude" : self.longitude
        }

class CityCycle(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(250), nullable=False)
    address = db.Column(db.String(250), nullable=False)
    latitude = db.Column(db.Integer, nullable=False)
    longitude = db.Column(db.Integer, nullable=False)

    def to_json(self):
        return {
            "id" : self.id,
            "name" : self.name,
            "address" : self.address,
            "latitude" : self.latitude,
            "longitude" : self.longitude
        }

@app.route("/bikeracks")
@crossdomain(origin="*")
def bike_racks():
    args = request.args
    latitude = args.get("latitude", False)
    longitude = args.get("longitude", False)
    distance = args.get("distance", False)

    return jsonify([item.to_json() for item in BikeRack.query.all()])

@app.route("/bubblers")
@crossdomain(origin="*")
def bublers():
    return jsonify([item.to_json() for item in Bubbler.query.all()])

@app.route("/meters")
@crossdomain(origin="*")
def meters():
    return jsonify([item.to_json() for item in Meter.query.all()])

@app.route("/citycycles")
@crossdomain(origin="*")
def citycycles():
    args = request.args
    start_latitude = args.get("start_latitude", False)
    start_longitude = args.get("start_longitude", False)
    end_latitude = args.get("end_latitude", False)
    end_longitude = args.get("end_longitude", False)
    distance = args.get("distance", False) # meters

    if not (start_latitude and start_longitude and end_latitude and end_longitude and distance):
        return "You must fill start_latitude and start_longitude and end_latitude and end_longitude and distance fields", 400

    start_latitude = float(start_latitude)
    start_longitude = float(start_longitude)
    end_latitude = float(end_latitude)
    end_longitude = float(end_longitude)

    lat_lng_dist = 0.0000101 * float(distance)

    
    # 0.000065

    best_cycles = CityCycle.query.filter(
        CityCycle.latitude <= end_latitude + lat_lng_dist,
        CityCycle.latitude >= end_latitude - lat_lng_dist,
        CityCycle.longitude <= end_longitude + lat_lng_dist,
        CityCycle.longitude >= end_longitude - lat_lng_dist
    ).order_by(
        'abs(latitude - %d) + abs(longitude - %d) desc' % (start_latitude, start_longitude)
    )
    return jsonify([item.to_json() for item in best_cycles.all()])
    

    # return "Hello World!" -27.466027, 153.013750, -27.466.043, 153.014760 //0.00101

if __name__ == "__main__":
    open("main.db", 'w').close()

    db.create_all()

    import csv
    with open('bike-racks.csv', 'r') as csvfile:
        reader = csv.reader(csvfile)

        iterrows = iter(reader)
        next(iterrows)
        for row in iterrows:
            print len(row)
            rack = BikeRack(
                id = row[0],
                suburb = row[1],
                address = row[2],
                location = row[3],
                capacity = row[4],
                rack_type = row[5],
                latitude = row[6],
                longitude = row[7]
            )
            db.session.add(rack)

    with open('meter-locations.csv', 'r') as csvfile:
        reader = csv.reader(csvfile)

        iterrows = iter(reader)
        next(iterrows)
        for row in iterrows:
            print len(row)
            rack = Meter(
                id = row[0],
                street = row[1],
                suburb = row[2],
                description = row[3],
                bays = row[4],
                latitude = row[5],
                longitude = row[6]
            )
            db.session.add(rack)
        
        db.session.commit()

    with open('bubblers.csv', 'r') as csvfile:
        reader = csv.reader(csvfile)

        iterrows = iter(reader)
        next(iterrows)
        for row in iterrows:
            print len(row)
            rack = Bubbler(
                id = row[0],
                suburb = row[1],
                park_name = row[2],
                item_type = row[3],
                bays = row[4],
                latitude = row[5],
                longitude = row[6]
            )
            db.session.add(rack)
        
        db.session.commit()

    with open('city-cycles.csv', 'r') as csvfile:
        reader = csv.reader(csvfile)

        iterrows = iter(reader)
        next(iterrows)
        for row in iterrows:
            print len(row)
            rack = CityCycle(
                id = row[0],
                name = row[1],
                address = row[2],
                latitude = row[3],
                longitude = row[4]
            )
            db.session.add(rack)
        
        db.session.commit()
   
    app.run("0.0.0.0", 80)

    # https://404575233422.signin.aws.amazon.com/console
