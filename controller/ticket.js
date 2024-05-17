const db = require("../config/database");
const PDFDocument = require("pdfkit");
const pool = db.promise(); // promisify pool
const fs = require("fs");

const generateTicketPDF = (ticketData) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const filename = `ticket_${ticketData.booking_id}.pdf`; // Adjust filename as needed
    const buffers = [];

    // Pipe PDF content to buffers
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      resolve({ filename, pdfData });
    });

    // Set up PDF styling for ticket
    // Load a font that supports Vietnamese characters
    const fontPath = "./controller/NotoSansJP-Regular.ttf"; // Replace with your font file path
    const customFont = fs.readFileSync(fontPath);
    doc.registerFont("CustomFont", customFont);

    // Set up PDF styling using the custom font
    doc.font("CustomFont").fontSize(12);

    // Define ticket layout using PDFKit methods
    doc.rect(30, 30, 540, 780).stroke(); // Ticket border

    // Calculate the position for "TRAIN TICKET" to center it horizontally
    const titleWidth = doc.widthOfString("TRAIN TICKET");
    const titleX = (doc.page.width - titleWidth) / 2;
    doc.text("TRAIN TICKET", titleX, 50, { bold: true });

    // Draw horizontal lines as separators
    doc.moveTo(50, 70).lineTo(550, 70).stroke();
    doc.moveTo(50, 90).lineTo(550, 90).stroke();

    // Add ticket details
    doc.text(`Booking ID: ${ticketData.booking_id}`, 60, 110);
    doc.text(`Departure Date: ${ticketData.departure_date}`, 60, 140);
    doc.text(`Departure Station: ${ticketData.departure_station}`, 60, 170);
    doc.text(`Arrival Station: ${ticketData.arrival_station}`, 60, 200);
    doc.text(`Passenger Name: ${ticketData.passenger_full_name}`, 60, 230);

    // Add more ticket details with increased spacing
    doc.text(`Departure Time: ${ticketData.departure_time}`, 60, 260);
    doc.text(`Ticket Price: ${ticketData.price}`, 60, 290);
    doc.text(`Seat ID: ${ticketData.seat_id}`, 60, 320);
    doc.text(`Carriage ID: ${ticketData.carriage_id}`, 60, 350);
    doc.text(`Route ID: ${ticketData.route_id}`, 60, 380);
    doc.text(`Train ID: ${ticketData.train_id}`, 60, 410);
    doc.text(`Station ID: ${ticketData.station_id}`, 60, 430);

    // Bold formatting for 'Status:' label and its content with a font size of 15
    doc.fontSize(14).text(`Status:`, 60, 460, { bold: true });
    doc.fontSize(14).text(`${ticketData.status}`, 130, 460);

    // Add additional decorative elements or information as needed...

    doc.end();
  });
};

const TicketInformationByCustomerID = async (req, res) => {
  const customer_id = req.params.customer_id;
  let connection;
  try {
    if (!customer_id) {
      return res.status(400).json({ message: "Ticket ID is required" });
    }

    connection = await pool.getConnection();
    await connection.beginTransaction(); // Begin transaction

    const [result] = await connection.query(
      "SELECT t.* FROM ticket t JOIN booking b ON t.booking_id = b.booking_id  WHERE b.customer_id = ?",
      [customer_id]
    );
    if (result.length === 0) {
      res.status(404).json({ message: "Ticket not found" });
      return;
    }

    const ticketData = result; // Assuming only one ticket is fetched

    // Instead of generating PDF, send the ticket data as JSON
    res.status(200).json(ticketData);

    await connection.commit(); // Commit the transaction
  } catch (err) {
    if (connection) {
      await connection.rollback(); // Rollback the transaction if an error occurs
    }
    console.error("Error fetching ticket details", err);
    res
      .status(500)
      .json({
        message: "Failed to fetch ticket details. Please try again later.",
      });
  } finally {
    if (connection) {
      connection.release(); // Release the connection back to the pool
    }
  }
};

const TicketInformationByBookingID = async (req, res) => {
  const booking_id = req.params.booking_id; // Assuming the booking ID is passed in the route parameters
  let connection;
  try {
    if (!booking_id) {
      return res.status(400).json({ message: "Booking ID is required" });
    }

    connection = await pool.getConnection();
    await connection.beginTransaction(); // Begin transaction

    const [result] = await connection.query(
      "SELECT t.* FROM ticket t JOIN booking b ON t.booking_id = b.booking_id  WHERE t.booking_id = ?",
      [booking_id]
    );
    if (result.length === 0) {
      res.status(404).json({ message: "Ticket not found" });
      return;
    }

    const ticketData = result[0]; // Assuming only one ticket is fetched based on the booking ID

    // Instead of generating PDF, send the ticket data as JSON
    res.status(200).json(ticketData);

    await connection.commit(); // Commit the transaction
  } catch (err) {
    if (connection) {
      await connection.rollback(); // Rollback the transaction if an error occurs
    }
    console.error("Error fetching ticket details", err);
    res
      .status(500)
      .json({
        message: "Failed to fetch ticket details. Please try again later.",
      });
  } finally {
    if (connection) {
      connection.release(); // Release the connection back to the pool
    }
  }
};

module.exports = { TicketInformationByBookingID };



const createTicketAPI = async (req, res) => {
  let connection; // Declare connection variable here

  const {
    booking_id,
    passenger_full_name,
    price,
    seat_id,
    carriage_id,
    route_id,
    train_id,
    passenger_citizen_identification_card,
    passenger_phonenumber,
    station_id,
    status = "Payment successful",
  } = req.body;

  try {
    connection = await pool.getConnection();

    const routeQuery =
      "SELECT departure_date, departure_time FROM route WHERE route_id = ?";
    const [routeRows] = await connection.query(routeQuery, [route_id]);
    const { departure_date, departure_time } = routeRows[0];

    const stationQuery = `
        SELECT s.departure_station, s.arrival_station
        FROM stationroute sr
        INNER JOIN station s ON sr.station_id = s.station_id
        WHERE sr.route_id = ? AND sr.station_id = ?
      `;
    const [stationRows] = await connection.query(stationQuery, [
      route_id,
      station_id,
    ]);
    const { departure_station, arrival_station } = stationRows[0];

    const ticketData = {
      booking_id,
      departure_date,
      departure_station,
      arrival_station,
      passenger_full_name,
      departure_time,
      price,
      seat_id,
      carriage_id,
      route_id,
      train_id,
      station_id,
      passenger_citizen_identification_card,
      passenger_phonenumber,
      status,
    };

    console.log("Ticket Data:", ticketData);

    const { filename, pdfData } = await generateTicketPDF(ticketData);

    connection = await pool.getConnection();
    await connection.beginTransaction();

    const insertTicketQuery = `
        INSERT INTO ticket
          (booking_id, route_id, train_id, carriage_id, seat_id, price, departure_date,
          departure_time, departure_station, arrival_station, passenger_full_name,
          passenger_citizen_identification_card, passenger_phonenumber, status, station_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

    const [queryResult] = await connection.execute(insertTicketQuery, [
      booking_id,
      route_id,
      train_id,
      carriage_id,
      seat_id,
      price,
      departure_date,
      departure_time,
      departure_station,
      arrival_station,
      passenger_full_name,
      passenger_citizen_identification_card,
      passenger_phonenumber,
      status,
      station_id,
    ]);

    console.log("Query Result:", queryResult);

    await connection.commit();

    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    res.setHeader("Content-Type", "application/pdf");
    res.send(pdfData);
  } catch (error) {
    console.error("Error creating ticket:", error);
    res
      .status(500)
      .json({ message: "Failed to create ticket. Please try again later." });

    if (connection) {
      await connection.rollback();
    }
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

const UpdateTicketByBookingId = async (req, res) => {
  const booking_id = req.params.booking_id;

  let connection;
  try {
    if (!booking_id) {
      return res.status(400).json({ message: "Booking ID is required" });
    }

    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Update ticket status to 'Cancel successful'
    const updateQuery = "UPDATE ticket SET status = 'Cancel successful' WHERE booking_id = ?";
    const [updateResult] = await connection.execute(updateQuery, [booking_id]);

    if (updateResult.affectedRows === 0) {
      // If no rows were affected, it means the ticket doesn't exist
      await connection.rollback();
      return res.status(404).json({ message: "Ticket not found" });
    }

    await connection.commit();
    res.status(200).json({ message: "Ticket cancellation successful" });
  } catch (err) {
    if (connection) {
      await connection.rollback();
    }
    console.error("Error canceling ticket:", err);
    res.status(500).json({ message: "Failed to cancel ticket. Please try again later." });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

module.exports = {
  TicketInformationByCustomerID,
  createTicketAPI,
  UpdateTicketByBookingId,
  TicketInformationByBookingID
};
