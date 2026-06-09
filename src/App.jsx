import { useEffect, useState } from 'react';
import './App.css';

import { client } from './lib/sanity';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Projects from './components/Projects';
import Systems from './components/Systems';
import Contact from './components/Contact';

const fallbackServices = [
  {
    title: 'Websites',
    description: 'Modern websites for creators, businesses, brands, and communities.',
  },
  {
    title: 'Discord Servers',
    description: 'Full Discord server setup with roles, permissions, bots, and structure.',
  },
  {
    title: 'Branding & Logos',
    description: 'Logos, colour systems, stream assets, panels, banners, and social graphics.',
  },
  {
    title: 'Automation & Bots',
    description: 'Custom Discord bots, Streamer.bot setups, dashboards, and automation tools.',
  },
];

const fallbackProjects = [
  {
    title: 'KSJ Goliath',
    type: 'Discord bot & dashboard',
    description: 'A community management system with moderation, logging, AutoMod, and dashboard controls.',
  },
  {
    title: 'Streamer Setups',
    type: 'Creative systems',
    description: 'Stream overlays, panels, branding assets, and automation setups for creators.',
  },
  {
    title: 'Client Websites',
    type: 'Web builds',
    description: 'Modern websites for brands, creators, businesses, and online communities.',
  },
];

function App() {
  const [services, setServices] = useState(fallbackServices);
  const [projects, setProjects] = useState(fallbackProjects);

  useEffect(() => {
    async function loadContent() {
      try {
        const [serviceData, projectData] = await Promise.all([
          client.fetch(`*[_type == "service"] | order(_createdAt asc) {
            _id,
            title,
            description
          }`),
          client.fetch(`*[_type == "project"] | order(_createdAt asc) {
          _id,
          title,
          type,
          description,
          image
          }`)
        ]);

        if (serviceData?.length) setServices(serviceData);
        if (projectData?.length) setProjects(projectData);
      } catch (error) {
        console.error('Sanity content failed to load:', error);
      }
    }

    loadContent();
  }, []);

  return (
    <main className="site">
      <Navbar />
      <Hero />
      <Services services={services} />
      <Projects projects={projects} />
      <Systems />
      <Contact />
    </main>
  );
}

export default App;