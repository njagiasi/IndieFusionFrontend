
import { Container } from 'react-bootstrap';
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Col from "react-bootstrap/Col";
import "./LandingPage.css";
import React from "react";
import { NavLink } from 'react-router-dom';

const LandingPage = () => {


  const cards = [
    {
      id: 1,
      title: "Individual Artists Collab",
      description: "one collaborations. Discover and connect with inspiring artists for one-on-Check their availability and start creating magic together!",
      image: "/Images/Images_landing/Indie_artist.png",
    },
    {
      id: 2,
      title: "Collaborate in Groups",
      description: "Team up with like-minded creators in dynamic groups. Share ideas, manage members, and bring bold visions to life!",
      image: "/Images/collab.png",
    },
    {
      id: 3,
      title: "Events",
      description: "Host or join exciting events to showcase your talent. Manage participants, adjust schedules, and take center stage!",
      image: "/Images/event.png",
    },
  ];

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" }); // Smooth scrolling
    }
  };

  return (
    <div>
      <div className="page-wrapper landing-page">
        <Navbar expand="lg" className="navbar header-footer-color">
          <div className='w-100'>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto justify-content-center w-100 col-gap">
                <NavLink to="#" onClick={() => scrollToSection("/")} className="nav-item text-decoration-none">
                  Home
                </NavLink>
                <NavLink to="#" onClick={() => scrollToSection("weprovide")} className="nav-item text-decoration-none">
                  We Provide
                </NavLink>
                <NavLink to="#" onClick={() => scrollToSection("features")} className="nav-item text-decoration-none">
                  Features
                </NavLink>
                <NavLink to="#" onClick={() => scrollToSection("mission")} className="nav-item text-decoration-none">
                  Mission
                </NavLink>
                <NavLink to="#" onClick={() => scrollToSection("aboutUs")} className="nav-item text-decoration-none">
                  About Us
                </NavLink>
                <NavLink to={'/login'} className="nav-item text-decoration-none">
                  Register/Login
                </NavLink>
              </Nav>
            </Navbar.Collapse>
          </div>
        </Navbar>
        <main>
          <div className="main-container">
            <div className="section1 pt-5">
              <Col sm={12} md={6} className="left-col">
                <h1>Indie</h1>
                <h1>Fusion</h1>
                <p>"Where Artists Unite, Collaborate, and Create."</p>
              </Col>
              <Col sm={12} md={6} className="right-col">
                <img src="/Images/Image1.png" alt="Hero" />
              </Col>
            </div>

            <div className="background-color p-5" id="weprovide">
              <div className='pb-5'>
                <h2 className='side-headings text-center'>Unleash Your Creativity with Indie Fusion</h2>
              </div>
              <div className='content-section'>
                <div>
                  <img src="/Images/painter.png" alt="About" className='w-100' />
                </div>
                <div>
                  <h6 className='content'>Unleash your artistry and connect with a vibrant community of musicians, designers, performers, and visionaries. Showcase your talent, spark collaborations, and bring impactful projects to life.
                    From one-on-one partnerships to unforgettable events, Indie Fusion empowers you to create without limits. Join us, share your passion, and make your mark in a world where dreams become reality. Let’s create something extraordinary together!
                  </h6>
                </div>
              </div>

            </div>

            <div id="features">
              <div className='pt-5'>
                <h2 className='side-headings text-center'>Our Features</h2>
              </div>
              <div className='p-5 explore-cards'>
                {
                  cards.map((card) => {
                    return <div>
                      <div className='card p-3'>
                        <img src={card.image} alt={card.title} className="card-image " />
                        <h3 className='pt-3'>{card.title} <span>{card.title2}</span></h3>
                        <p>{card.description}</p>
                      </div>
                    </div>
                  })
                }
              </div>
            </div>

            <div className="background-color p-5" id="mission">
              <div className='pb-5'>
                <h2 className='side-headings text-center'>Our Mission</h2>
              </div>
              <div className='content-section reverse-dir '>
                <div>
                  <img src="/Images/mission2.png" alt="About" className='w-100' />
                </div>
                <div>
                  <h6 className='content text-start'>To empower independent artists worldwide by providing a collaborative platform that fosters connection, creativity, and growth. We aim to bridge the gap between talent and opportunity, helping artists thrive in their artistic journeys.
                  </h6>
                </div>
              </div>

            </div>

            <div className="p-5 bg-transparent-color" id="aboutUs">
              <div className='pb-4'>
                <h2 className='side-headings text-center'>About Us</h2>
              </div>
              <div className='content-section'>
                <div>
                  <img src="/Images/about-us.avif" alt="About" className='w-100' />
                </div>
                <div>
                  <h6 className='content'>
                    Indie Fusion is a vibrant platform designed to connect independent artists from diverse fields, enabling them to showcase their talents, collaborate on creative projects, and organize impactful events. Our mission is to foster a supportive community where innovation thrives, and artists can seamlessly network, share their passion, and bring their artistic visions to life. At Indie Fusion, we believe in the power of collaboration to fuel creativity and elevate independent artistry.
                  </h6>
                </div>
              </div>

            </div>
          </div>
        </main>
        <footer>
          <Container fluid className="footer header-footer-color">
            <Container>
              <p className='text-center copy-right mb-0'>
                &copy; Copyright 2024 ~ Indie Fusion</p>
            </Container>

          </Container>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
