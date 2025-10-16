// import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
// import axios from "axios";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   FiUpload,
//   FiLoader,
//   FiAlertTriangle,
//   FiCheckCircle,
//   FiArrowRight,
//   FiArrowLeft,
//   FiSearch,
//   FiX,
//   FiChevronDown,
//   FiCheck,
//   FiStar,
//   FiMapPin,
//   FiUser,
//   FiCalendar,
//   FiVideo,
//   FiClock,
//   FiFileText,
//   FiShield,
//   FiTrash2,
// } from "react-icons/fi";

// import Payment from "../../payments/Payment";

// // Memoized StyleBlock component - prevents style re-injection on every render
// const StyleBlock = React.memo(function StyleBlock() {
//   return (
//     <style jsx>{`
//       /* Reset and Base Styles */
//       * {
//         box-sizing: border-box;
//         margin: 0;
//         padding: 0;
//       }

//       :root {
//         --primary-50: #ecfeff;
//         --primary-100: #cffafe;
//         --primary-500: #06b6d4;
//         --primary-600: #0891b2;
//         --primary-700: #0e7490;
//         --success-50: #f0fdf4;
//         --success-500: #22c55e;
//         --success-600: #16a34a;
//         --error-50: #fef2f2;
//         --error-500: #ef4444;
//         --error-600: #dc2626;
//         --gray-50: #f8fafc;
//         --gray-100: #f1f5f9;
//         --gray-200: #e2e8f0;
//         --gray-300: #cbd5e1;
//         --gray-400: #94a3b8;
//         --gray-500: #64748b;
//         --gray-600: #475569;
//         --gray-700: #334155;
//         --gray-800: #1e293b;
//         --gray-900: #0f172a;
//         --space-xs: 0.25rem;
//         --space-sm: 0.5rem;
//         --space-md: 1rem;
//         --space-lg: 1.5rem;
//         --space-xl: 2rem;
//         --space-2xl: 3rem;
//         --font-sm: 0.875rem;
//         --font-base: 1rem;
//         --font-lg: 1.125rem;
//         --font-xl: 1.25rem;
//         --font-2xl: 1.5rem;
//         --font-3xl: 1.875rem;
//         --radius-sm: 0.375rem;
//         --radius-md: 0.5rem;
//         --radius-lg: 0.75rem;
//         --radius-xl: 1rem;
//         --radius-2xl: 1.5rem;
//         --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
//         --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
//         --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
//         --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
//         --transition-fast: 150ms ease-in-out;
//         --transition-base: 200ms ease-in-out;
//         --transition-slow: 300ms ease-in-out;
//       }

//       body {
//         font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
//         line-height: 1.5;
//         color: var(--gray-900);
//         background: linear-gradient(to bottom, #f0f9ff 0%, #ffffff 100%);
//         min-height: 100vh;
//       }

//       .second-opinion-container {
//         max-width: 1440px;
//         margin: 0 auto;
//         padding: var(--space-xl);
//         min-height: 100vh;
//       }

//       .so-form {
//         display: flex;
//         flex-direction: column;
//         gap: var(--space-xl);
//       }

//       /* Enhanced Hero Section */
//       .hero-section {
//         background: linear-gradient(135deg, rgba(6, 182, 212, 0.05) 0%, rgba(255, 255, 255, 0.9) 100%);
//         border-radius: var(--radius-xl);
//         padding: var(--space-2xl);
//         border: 1px solid var(--gray-200);
//         position: relative;
//         overflow: hidden;
//       }

//       .hero-section::before {
//         content: '';
//         position: absolute;
//         top: 0;
//         right: 0;
//         bottom: 0;
//         left: 0;
//         background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
//         pointer-events: none;
//       }

//       .hero-content {
//         display: grid;
//         grid-template-columns: 1fr auto;
//         gap: var(--space-2xl);
//         align-items: center;
//         position: relative;
//         z-index: 1;
//       }

//       .hero-text {
//         max-width: 700px;
//       }

//       .hero-title {
//         font-size: 2rem;
//         font-weight: 700;
//         color: #0c4a6e;
//         margin-bottom: var(--space-md);
//         line-height: 1.2;
//         letter-spacing: -0.01em;
//       }

//       .hero-description {
//         font-size: var(--font-base);
//         color: var(--gray-600);
//         line-height: 1.6;
//         font-weight: 400;
//       }

//       .hero-controls {
//         display: flex;
//         flex-direction: column;
//         gap: var(--space-md);
//         min-width: 420px;
//       }

//       /* Enhanced Search Container */
//       .search-container {
//         display: flex;
//         align-items: center;
//         background: white;
//         border-radius: var(--radius-lg);
//         padding: var(--space-md);
//         box-shadow: var(--shadow-sm);
//         border: 1px solid var(--gray-200);
//         transition: all var(--transition-base);
//         position: relative;
//       }

//       .search-container:focus-within {
//         border-color: var(--primary-500);
//         box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
//       }

//       .search-icon {
//         color: var(--gray-400);
//         margin-right: var(--space-md);
//         flex-shrink: 0;
//         font-size: 1.1rem;
//         transition: var(--transition-fast);
//       }

//       .search-container:focus-within .search-icon {
//         color: var(--primary-500);
//       }

//       .search-input {
//         flex: 1;
//         border: none;
//         outline: none;
//         font-size: 0.875rem;
//         background: transparent;
//         font-weight: 400;
//         color: var(--gray-700);
//         line-height: 1.5;
//       }

//       .search-input::placeholder {
//         color: var(--gray-400);
//         font-weight: 400;
//       }

//       .clear-search {
//         background: var(--gray-100);
//         border: none;
//         color: var(--gray-500);
//         cursor: pointer;
//         padding: var(--space-sm);
//         border-radius: 50%;
//         transition: var(--transition-fast);
//         margin-left: var(--space-sm);
//         width: 28px;
//         height: 28px;
//         display: flex;
//         align-items: center;
//         justify-content: center;
//       }

//       .clear-search:hover {
//         background: var(--gray-200);
//         color: var(--gray-700);
//       }

//       .control-row {
//         display: flex;
//         gap: var(--space-md);
//         align-items: center;
//       }

//       .sort-select {
//         flex: 1;
//         padding: var(--space-md);
//         border: 1px solid var(--gray-200);
//         border-radius: var(--radius-md);
//         background: white;
//         font-size: var(--font-sm);
//         font-weight: 400;
//         cursor: pointer;
//         box-shadow: var(--shadow-sm);
//         transition: var(--transition-base);
//       }

//       .sort-select:focus {
//         outline: none;
//         border-color: var(--primary-500);
//         box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
//       }

//       .filter-toggle {
//         display: flex;
//         align-items: center;
//         gap: var(--space-sm);
//         padding: var(--space-md);
//         background: white;
//         border: 1px solid var(--gray-200);
//         border-radius: var(--radius-md);
//         cursor: pointer;
//         font-size: var(--font-sm);
//         font-weight: 500;
//         color: var(--primary-600);
//         transition: var(--transition-base);
//         box-shadow: var(--shadow-sm);
//       }

//       .filter-toggle:hover {
//         background: var(--primary-50);
//         border-color: var(--primary-500);
//       }

//       .chevron {
//         transition: transform var(--transition-fast);
//       }

//       .chevron.rotated {
//         transform: rotate(180deg);
//       }

//       /* Stepper */
//       .stepper-container {
//         background: white;
//         border-radius: var(--radius-lg);
//         padding: var(--space-lg);
//         box-shadow: var(--shadow-sm);
//         border: 1px solid var(--gray-200);
//       }

//       .progress-track {
//         height: 4px;
//         background: var(--gray-200);
//         border-radius: 999px;
//         overflow: hidden;
//         margin-bottom: var(--space-lg);
//       }

//       .progress-bar {
//         height: 100%;
//         background: linear-gradient(90deg, var(--primary-500), var(--primary-600));
//         border-radius: 999px;
//         transition: width var(--transition-slow);
//       }

//       .step-items {
//         display: grid;
//         grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
//         gap: var(--space-lg);
//       }

//       .step-item {
//         display: flex;
//         flex-direction: column;
//         align-items: center;
//         text-align: center;
//         gap: var(--space-md);
//       }

//       .step-indicator {
//         width: 40px;
//         height: 40px;
//         border-radius: 50%;
//         display: flex;
//         align-items: center;
//         justify-content: center;
//         font-weight: 600;
//         font-size: 0.875rem;
//         border: 2px solid var(--gray-300);
//         background: white;
//         color: var(--gray-500);
//         transition: var(--transition-base);
//       }

//       .step-item.active .step-indicator {
//         background: var(--primary-500);
//         color: white;
//         border-color: var(--primary-500);
//       }

//       .step-item.completed .step-indicator {
//         background: var(--success-500);
//         color: white;
//         border-color: var(--success-500);
//       }

//       .step-label {
//         font-size: var(--font-sm);
//         font-weight: 500;
//         color: var(--gray-600);
//         max-width: 150px;
//       }

//       .step-item.active .step-label {
//         color: var(--primary-600);
//         font-weight: 600;
//       }

//       .step-item.completed .step-label {
//         color: var(--success-600);
//       }

//       /* Layout */
//       .so-layout {
//         display: grid;
//         grid-template-columns: 280px 1fr 320px;
//         gap: var(--space-lg);
//         align-items: start;
//       }

//       @media (max-width: 1200px) {
//         .so-layout {
//           grid-template-columns: 280px 1fr 300px;
//           gap: var(--space-lg);
//         }
//       }

//       @media (max-width: 1024px) {
//         .so-layout {
//           grid-template-columns: 1fr;
//           gap: var(--space-lg);
//         }
        
//         .filter-sidebar {
//           order: 2;
//         }
        
//         .so-main {
//           order: 1;
//         }
        
//         .summary-sidebar {
//           order: 3;
//         }
//       }

//       /* Enhanced Filter Sidebar */
//       .filter-sidebar {
//         background: white;
//         border-radius: var(--radius-lg);
//         border: 1px solid var(--gray-200);
//         box-shadow: var(--shadow-sm);
//         overflow: hidden;
//         transition: var(--transition-base);
//       }

//       .filter-sidebar.collapsed {
//         display: none;
//       }

//       .filter-section {
//         padding: var(--space-lg);
//         border-bottom: 1px solid var(--gray-200);
//       }

//       .filter-header {
//         display: flex;
//         justify-content: space-between;
//         align-items: center;
//         margin-bottom: var(--space-lg);
//       }

//       .filter-header h3 {
//         font-size: var(--font-base);
//         font-weight: 600;
//         color: var(--gray-900);
//       }

//       .clear-filters {
//         background: none;
//         border: none;
//         color: var(--primary-600);
//         font-size: var(--font-sm);
//         font-weight: 500;
//         cursor: pointer;
//         padding: var(--space-xs) var(--space-sm);
//         border-radius: var(--radius-sm);
//         transition: var(--transition-fast);
//       }

//       .clear-filters:hover {
//         background: var(--primary-50);
//       }

//       .filter-group {
//         margin-bottom: var(--space-lg);
//       }

//       .filter-label {
//         display: block;
//         font-size: var(--font-sm);
//         font-weight: 500;
//         color: var(--gray-700);
//         margin-bottom: var(--space-sm);
//       }

//       .filter-select {
//         width: 100%;
//         padding: var(--space-md);
//         border: 1px solid var(--gray-300);
//         border-radius: var(--radius-md);
//         font-size: var(--font-sm);
//         background: white;
//         cursor: pointer;
//         transition: var(--transition-fast);
//       }

//       .filter-select:focus {
//         outline: none;
//         border-color: var(--primary-500);
//         box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
//       }

//       .doctors-list {
//         padding: var(--space-lg) 0;
        
//       }

//       .doctors-header {
//         padding: 0 var(--space-lg);
//         margin-bottom: var(--space-md);
//       }

//       .doctors-header h4 {
//         font-size: 0.875rem;
//         font-weight: 600;
//         color: var(--gray-900);
//         margin-bottom: var(--space-sm);
//       }

//       .doctors-scroll {
//         max-height: 500px;
//         overflow-y: auto;
//         padding: 0 var(--space-lg);
//       }

//       .doctors-scroll::-webkit-scrollbar {
//         width: 4px;
//       }

//       .doctors-scroll::-webkit-scrollbar-track {
//         background: var(--gray-100);
//       }

//       .doctors-scroll::-webkit-scrollbar-thumb {
//         background: var(--gray-300);
//         border-radius: 999px;
//       }

//       /* Enhanced No Doctors State */
//       .no-doctors {
//         text-align: center;
//         padding: var(--space-2xl);
//         color: var(--gray-500);
//       }

//       .no-doctors-icon {
//         font-size: 2rem;
//         color: var(--gray-400);
//         margin-bottom: var(--space-md);
//       }

//       .clear-search-btn {
//         margin-top: var(--space-md);
//         padding: var(--space-sm) var(--space-md);
//         background: var(--primary-500);
//         color: white;
//         border: none;
//         border-radius: var(--radius-md);
//         cursor: pointer;
//         font-size: var(--font-sm);
//         transition: var(--transition-fast);
//       }

//       .clear-search-btn:hover {
//         background: var(--primary-600);
//       }

//       /* Doctor Card */
//       .doctor-card {
//         display: flex;
//         align-items: center;
//         gap: var(--space-md);
//         width: 100%;
//         padding: var(--space-md);
//         margin-bottom: var(--space-sm);
//         background: white;
//         border: 2px solid transparent;
//         border-radius: var(--radius-lg);
//         cursor: pointer;
//         transition: var(--transition-base);
//         position: relative;
//         text-align: left;
//       }

//       .doctor-card:hover {
//         transform: translateY(-2px);
//         box-shadow: var(--shadow-md);
//         border-color: var(--gray-200);
//       }

//       .doctor-card.selected {
//         border-color: var(--primary-500);
//         background: linear-gradient(135deg, var(--primary-50), rgba(255, 255, 255, 0.8));
//       }

//       .doctor-avatar {
//         width: 44px;
//         height: 44px;
//         border-radius: var(--radius-md);
//         background: linear-gradient(135deg, #0891b2, #06b6d4);
//         color: white;
//         display: flex;
//         align-items: center;
//         justify-content: center;
//         font-weight: 600;
//         font-size: 0.8125rem;
//         flex-shrink: 0;
//       }

//       .doctor-info {
//         flex: 1;
//         min-width: 0;
//       }

//       .doctor-name {
//         font-size: 0.875rem;
//         font-weight: 600;
//         color: var(--gray-900);
//         margin: 0 0 var(--space-xs) 0;
//       }

//       .doctor-specialty {
//         font-size: var(--font-sm);
//         color: var(--gray-600);
//         margin: 0 0 var(--space-sm) 0;
//       }

//       .doctor-meta {
//         display: flex;
//         align-items: center;
//         gap: var(--space-md);
//         font-size: var(--font-sm);
//       }

//       .rating {
//         display: flex;
//         align-items: center;
//         gap: var(--space-xs);
//         color: var(--gray-600);
//       }

//       .star-icon {
//         color: #fbbf24;
//       }

//       .location {
//         display: flex;
//         align-items: center;
//         gap: var(--space-xs);
//         color: var(--gray-600);
//       }

//       .location-icon {
//         color: var(--gray-400);
//       }

//       .doctor-availability {
//         margin-top: var(--space-sm);
//       }

//       .availability-status {
//         padding: var(--space-xs) var(--space-sm);
//         border-radius: var(--radius-sm);
//         font-size: 0.75rem;
//         font-weight: 500;
//       }

//       .availability-status.available {
//         background: var(--success-50);
//         color: var(--success-600);
//       }

//       .availability-status.busy {
//         background: var(--gray-100);
//         color: var(--gray-600);
//       }

//       .doctor-fee {
//         text-align: right;
//         flex-shrink: 0;
//       }

//       .fee-amount {
//         display: block;
//         font-size: var(--font-base);
//         font-weight: 700;
//         color: #0c4a6e;
//       }

//       .fee-label {
//         font-size: var(--font-sm);
//         color: var(--gray-500);
//       }

//       .selection-indicator {
//         position: absolute;
//         top: var(--space-md);
//         right: var(--space-md);
//         width: 24px;
//         height: 24px;
//         background: var(--success-500);
//         color: white;
//         border-radius: 50%;
//         display: flex;
//         align-items: center;
//         justify-content: center;
//         font-size: 12px;
//       }

//       /* Main Content Area */
//       .so-main {
//         background: white;
//         border-radius: var(--radius-lg);
//         border: 1px solid var(--gray-200);
//         box-shadow: var(--shadow-sm);
//         overflow: hidden;
//       }

//       .step-panel {
//         padding: var(--space-xl);
//         min-height: 450px;
//       }

//       .step-content {
//         max-width: 100%;
//       }

//       .step-header {
//         margin-bottom: var(--space-2xl);
//       }

//       .step-header h2 {
//         font-size: var(--font-xl);
//         font-weight: 600;
//         color: #0c4a6e;
//         margin-bottom: var(--space-sm);
//       }

//       .step-header p {
//         font-size: var(--font-base);
//         color: var(--gray-600);
//         line-height: 1.6;
//       }

//       /* Featured Doctors */
//       .featured-doctors {
//         display: grid;
//         grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
//         gap: var(--space-lg);
//       }

//       .featured-doctor-card {
//         display: flex;
//         align-items: center;
//         gap: var(--space-md);
//         padding: var(--space-lg);
//         background: var(--gray-50);
//         border-radius: var(--radius-lg);
//         border: 1px solid var(--gray-200);
//       }

//       .fd-avatar {
//         width: 56px;
//         height: 56px;
//         border-radius: var(--radius-lg);
//         background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
//         color: white;
//         display: flex;
//         align-items: center;
//         justify-content: center;
//         font-weight: 600;
//         font-size: var(--font-base);
//       }

//       .fd-info h4 {
//         font-size: var(--font-base);
//         font-weight: 600;
//         color: var(--gray-900);
//         margin: 0 0 var(--space-xs) 0;
//       }

//       .fd-info p {
//         font-size: var(--font-sm);
//         color: var(--gray-600);
//         margin: 0 0 var(--space-sm) 0;
//       }

//       .fd-fee {
//         font-size: var(--font-sm);
//         font-weight: 600;
//         color: var(--primary-600);
//         background: var(--primary-50);
//         padding: var(--space-xs) var(--space-sm);
//         border-radius: var(--radius-sm);
//       }

//       /* Form Styles */
//       .form-group {
//         margin-bottom: var(--space-xl);
//       }

//       .form-label {
//         display: flex;
//         align-items: center;
//         gap: var(--space-sm);
//         font-size: var(--font-sm);
//         font-weight: 600;
//         color: var(--gray-700);
//         margin-bottom: var(--space-sm);
//       }

//       .label-icon {
//         color: var(--primary-500);
//       }

//       .form-textarea,
//       .form-input,
//       .form-select {
//         width: 100%;
//         padding: var(--space-md);
//         border: 1px solid var(--gray-300);
//         border-radius: var(--radius-md);
//         font-size: var(--font-base);
//         font-family: inherit;
//         transition: var(--transition-fast);
//         background: white;
//       }

//       .form-textarea {
//         resize: vertical;
//         min-height: 120px;
//       }

//       .form-textarea:focus,
//       .form-input:focus,
//       .form-select:focus {
//         outline: none;
//         border-color: var(--primary-500);
//         box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
//       }

//       .form-textarea::placeholder,
//       .form-input::placeholder {
//         color: var(--gray-400);
//       }

//       .schedule-grid {
//         display: grid;
//         grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
//         gap: var(--space-lg);
//       }

//       /* File Upload */
//       .file-upload-area {
//         border: 2px dashed var(--gray-300);
//         border-radius: var(--radius-lg);
//         padding: var(--space-2xl);
//         text-align: center;
//         cursor: pointer;
//         transition: var(--transition-base);
//         background: var(--gray-50);
//       }

//       .file-upload-area:hover {
//         border-color: var(--primary-500);
//         background: var(--primary-50);
//       }

//       .upload-icon {
//         font-size: 48px;
//         color: var(--primary-500);
//         margin-bottom: var(--space-lg);
//       }

//       .upload-text h3 {
//         font-size: var(--font-lg);
//         font-weight: 600;
//         color: var(--gray-900);
//         margin-bottom: var(--space-sm);
//       }

//       .upload-text p {
//         font-size: var(--font-sm);
//         color: var(--gray-600);
//       }

//       .uploaded-files {
//         margin-top: var(--space-xl);
//       }

//       .uploaded-files h4 {
//         font-size: var(--font-base);
//         font-weight: 600;
//         color: var(--gray-900);
//         margin-bottom: var(--space-lg);
//       }

//       .file-list {
//         display: flex;
//         flex-direction: column;
//         gap: var(--space-md);
//       }

//       .file-item {
//         display: flex;
//         align-items: center;
//         gap: var(--space-md);
//         padding: var(--space-md);
//         background: var(--gray-50);
//         border-radius: var(--radius-md);
//         border: 1px solid var(--gray-200);
//       }

//       .file-preview {
//         width: 64px;
//         height: 64px;
//         border-radius: var(--radius-md);
//         overflow: hidden;
//         flex-shrink: 0;
//         background: var(--gray-200);
//         display: flex;
//         align-items: center;
//         justify-content: center;
//       }

//       .file-preview img {
//         width: 100%;
//         height: 100%;
//         object-fit: cover;
//       }

//       .file-placeholder {
//         background: var(--primary-100);
//         color: var(--primary-600);
//         font-weight: 600;
//         font-size: var(--font-sm);
//         width: 100%;
//         height: 100%;
//         display: flex;
//         align-items: center;
//         justify-content: center;
//       }

//       .file-details {
//         flex: 1;
//         min-width: 0;
//       }

//       .file-details h5 {
//         font-size: var(--font-sm);
//         font-weight: 600;
//         color: var(--gray-900);
//         margin: 0 0 var(--space-xs) 0;
//         overflow: hidden;
//         text-overflow: ellipsis;
//         white-space: nowrap;
//       }

//       .file-details p {
//         font-size: var(--font-sm);
//         color: var(--gray-600);
//         margin: 0;
//       }

//       .remove-file {
//         background: var(--error-50);
//         color: var(--error-600);
//         border: none;
//         border-radius: var(--radius-sm);
//         padding: var(--space-sm);
//         cursor: pointer;
//         transition: var(--transition-fast);
//         flex-shrink: 0;
//       }

//       .remove-file:hover {
//         background: var(--error-100);
//       }

//       /* Navigation Buttons */
//       .navigation-buttons {
//         display: flex;
//         justify-content: space-between;
//         align-items: center;
//         padding: var(--space-xl);
//         border-top: 1px solid var(--gray-200);
//         background: var(--gray-50);
//       }

//       .nav-btn {
//         display: flex;
//         align-items: center;
//         gap: var(--space-sm);
//         padding: var(--space-md) var(--space-lg);
//         border-radius: var(--radius-lg);
//         font-size: var(--font-base);
//         font-weight: 600;
//         cursor: pointer;
//         transition: var(--transition-base);
//         border: none;
//         text-decoration: none;
//       }

//       .prev-btn {
//         background: white;
//         color: var(--gray-700);
//         border: 1px solid var(--gray-300);
//       }

//       .prev-btn:hover:not(.disabled) {
//         background: var(--gray-50);
//         border-color: var(--gray-400);
//       }

//       .next-btn {
//         background: var(--primary-500);
//         color: white;
//         border: 1px solid var(--primary-500);
//       }

//       .next-btn:hover {
//         background: var(--primary-600);
//         border-color: var(--primary-600);
//       }

//       .submit-btn {
//         background: linear-gradient(135deg, var(--success-500), var(--success-600));
//         color: white;
//         border: none;
//       }

//       .submit-btn:hover:not(:disabled) {
//         background: linear-gradient(135deg, var(--success-600), var(--success-700));
//         transform: translateY(-1px);
//         box-shadow: var(--shadow-lg);
//       }

//       .nav-btn.disabled {
//         opacity: 0.5;
//         cursor: not-allowed;
//         pointer-events: none;
//       }

//       .spinner {
//         animation: spin 1s linear infinite;
//       }

//       @keyframes spin {
//         from { transform: rotate(0deg); }
//         to { transform: rotate(360deg); }
//       }

//       /* Summary Sidebar */
//       .summary-sidebar {
//         display: flex;
//         flex-direction: column;
//         gap: var(--space-lg);
//       }

//       .summary-card {
//         background: white;
//         border-radius: var(--radius-lg);
//         border: 1px solid var(--gray-200);
//         box-shadow: var(--shadow-sm);
//         overflow: hidden;
//       }

//       .summary-header {
//         padding: var(--space-lg);
//         border-bottom: 1px solid var(--gray-200);
//         background: linear-gradient(135deg, rgba(6, 182, 212, 0.03), rgba(255, 255, 255, 1));
//       }

//       .summary-header h3 {
//         font-size: var(--font-base);
//         font-weight: 600;
//         color: #0c4a6e;
//         margin: 0 0 var(--space-xs) 0;
//       }

//       .summary-header p {
//         font-size: var(--font-sm);
//         color: var(--gray-600);
//         margin: 0;
//       }

//       .summary-details {
//         padding: var(--space-lg);
//       }

//       .summary-item {
//         display: flex;
//         justify-content: space-between;
//         align-items: flex-start;
//         gap: var(--space-md);
//         margin-bottom: var(--space-lg);
//         padding-bottom: var(--space-lg);
//         border-bottom: 1px solid var(--gray-100);
//       }

//       .summary-item:last-child {
//         margin-bottom: 0;
//         padding-bottom: 0;
//         border-bottom: none;
//       }

//       .item-label {
//         display: flex;
//         align-items: center;
//         gap: var(--space-sm);
//         font-size: var(--font-sm);
//         font-weight: 500;
//         color: var(--gray-600);
//         min-width: 80px;
//       }

//       .item-icon {
//         color: var(--primary-500);
//       }

//       .item-value {
//         font-size: var(--font-sm);
//         font-weight: 600;
//         color: var(--gray-900);
//         text-align: right;
//         flex: 1;
//       }

//       .fee-section {
//         background: #f0f9ff;
//         padding: var(--space-lg);
//         border-top: 1px solid var(--gray-200);
//       }

//       .fee-breakdown {
//         margin-bottom: var(--space-md);
//       }

//       .fee-item {
//         display: flex;
//         justify-content: space-between;
//         align-items: center;
//         margin-bottom: var(--space-sm);
//         font-size: var(--font-sm);
//       }

//       .fee-item.subtotal {
//         padding-top: var(--space-md);
//         border-top: 1px solid var(--gray-200);
//         font-weight: 700;
//         font-size: var(--font-base);
//         color: var(--gray-900);
//       }

//       .fee-note {
//         font-size: 0.75rem;
//         color: var(--gray-500);
//         margin: 0 0 var(--space-lg) 0;
//         line-height: 1.4;
//       }

//       .quick-actions {
//         display: flex;
//         gap: var(--space-sm);
//       }

//       .quick-btn {
//         flex: 1;
//         padding: var(--space-sm) var(--space-md);
//         border: 1px solid var(--primary-200);
//         background: var(--primary-50);
//         color: var(--primary-600);
//         border-radius: var(--radius-md);
//         font-size: var(--font-sm);
//         font-weight: 500;
//         cursor: pointer;
//         transition: var(--transition-fast);
//       }

//       .quick-btn:hover {
//         background: var(--primary-100);
//         border-color: var(--primary-300);
//       }

//       .services-card {
//         background: white;
//         border-radius: var(--radius-lg);
//         border: 1px solid var(--gray-200);
//         box-shadow: var(--shadow-sm);
//         padding: var(--space-lg);
//       }

//       .services-card h4 {
//         font-size: 0.875rem;
//         font-weight: 600;
//         color: #0c4a6e;
//         margin: 0 0 var(--space-md) 0;
//       }

//       .services-list {
//         display: flex;
//         flex-direction: column;
//         gap: var(--space-md);
//       }

//       .service-item {
//         display: flex;
//         align-items: flex-start;
//         gap: var(--space-md);
//       }

//       .service-icon {
//         width: 36px;
//         height: 36px;
//         border-radius: var(--radius-md);
//         background: #ecfeff;
//         color: var(--primary-600);
//         display: flex;
//         align-items: center;
//         justify-content: center;
//         flex-shrink: 0;
//       }

//       .service-info h5 {
//         font-size: var(--font-sm);
//         font-weight: 600;
//         color: var(--gray-900);
//         margin: 0 0 var(--space-xs) 0;
//       }

//       .service-info p {
//         font-size: var(--font-sm);
//         color: var(--gray-600);
//         margin: 0;
//         line-height: 1.4;
//       }

//       /* Toast */
//       .toast {
//         position: fixed;
//         top: var(--space-xl);
//         right: var(--space-xl);
//         display: flex;
//         align-items: center;
//         gap: var(--space-md);
//         padding: var(--space-lg);
//         border-radius: var(--radius-lg);
//         box-shadow: var(--shadow-xl);
//         max-width: 400px;
//         z-index: 1000;
//         animation: slideIn 0.3s ease-out;
//       }

//       .toast-success {
//         background: var(--success-50);
//         color: var(--success-800);
//         border: 1px solid var(--success-200);
//       }

//       .toast-error {
//         background: var(--error-50);
//         color: var(--error-800);
//         border: 1px solid var(--error-200);
//       }

//       .toast-icon {
//         flex-shrink: 0;
//         font-size: var(--font-lg);
//       }

//       .toast-content {
//         flex: 1;
//         min-width: 0;
//       }

//       .toast-content p {
//         margin: 0;
//         font-size: var(--font-sm);
//         font-weight: 500;
//       }

//       .toast-close {
//         background: none;
//         border: none;
//         color: inherit;
//         cursor: pointer;
//         padding: var(--space-xs);
//         border-radius: var(--radius-sm);
//         opacity: 0.7;
//         transition: var(--transition-fast);
//         flex-shrink: 0;
//       }

//       .toast-close:hover {
//         opacity: 1;
//         background: rgba(0, 0, 0, 0.1);
//       }

//       @keyframes slideIn {
//         from {
//           transform: translateX(100%);
//           opacity: 0;
//         }
//         to {
//           transform: translateX(0);
//           opacity: 1;
//         }
//       }

//       /* Responsive Design */
//       @media (max-width: 768px) {
//         .second-opinion-container {
//           padding: var(--space-md);
//         }
        
//         .hero-content {
//           grid-template-columns: 1fr;
//           text-align: center;
//           gap: var(--space-xl);
//         }
        
//         .hero-controls {
//           min-width: auto;
//           width: 100%;
//         }
        
//         .control-row {
//           flex-direction: column;
//         }
        
//         .schedule-grid {
//           grid-template-columns: 1fr;
//         }
        
//         .featured-doctors {
//           grid-template-columns: 1fr;
//         }
        
//         .navigation-buttons {
//           flex-direction: column;
//           gap: var(--space-md);
//         }
        
//         .nav-btn {
//           width: 100%;
//           justify-content: center;
//         }
        
//         .toast {
//           left: var(--space-md);
//           right: var(--space-md);
//           top: var(--space-md);
//           max-width: none;
//         }
//       }

//       @media (max-width: 480px) {
//         .step-items {
//           grid-template-columns: 1fr;
//         }
        
//         .doctor-card {
//           flex-direction: column;
//           text-align: center;
//         }
        
//         .doctor-fee {
//           text-align: center;
//         }
        
//         .summary-item {
//           flex-direction: column;
//           text-align: center;
//         }
        
//         .item-label {
//           min-width: auto;
//         }
        
//         .item-value {
//           text-align: center;
//         }
//       }
//     `}</style>
//   );
// });

// // Memoized subcomponents to prevent re-renders during typing
// const HeroSection = React.memo(function HeroSection({ 
//   searchQuery, 
//   onSearchChange, 
//   onClearSearch, 
//   sortBy, 
//   onSortChange, 
//   showFilters, 
//   onToggleFilters 
// }) {
//   const searchInputRef = useRef(null);

//   const clearSearch = useCallback(() => {
//     onClearSearch();
//     if (searchInputRef.current) {
//       searchInputRef.current.focus();
//     }
//   }, [onClearSearch]);

//   return (
//     <section className="hero-section">
//       <div className="hero-content">
//         <div className="hero-text">
//           <h1 className="hero-title">Get Expert Second Opinion</h1>
//           <p className="hero-description">
//             Connect with specialist doctors, share your medical reports, and get professional 
//             second opinions from the comfort of your home. Our network of qualified specialists 
//             is ready to provide you with comprehensive medical consultations.
//           </p>
//         </div>

//         <div className="hero-controls">
//           <div className="search-container">
//             <FiSearch className="search-icon" />
//             <input
//               ref={searchInputRef}
//               type="text"
//               className="search-input"
//               value={searchQuery}
//               onChange={onSearchChange}
//               placeholder="Search doctors, specialty or location"
//               aria-label="Search doctors"
//               autoComplete="off"
//               spellCheck="false"
//             />
//             {searchQuery && (
//               <button
//                 type="button"
//                 className="clear-search"
//                 onClick={clearSearch}
//                 tabIndex={-1}
//               >
//                 <FiX />
//               </button>
//             )}
//           </div>

//           <div className="control-row">
//             <select
//               value={sortBy}
//               onChange={onSortChange}
//               className="sort-select"
//             >
//               <option value="relevance">Sort by Relevance</option>
//               <option value="name">Sort by Name</option>
//               <option value="fee-asc">Fee: Low to High</option>
//               <option value="fee-desc">Fee: High to Low</option>
//             </select>

//             <button
//               type="button"
//               className="filter-toggle"
//               onClick={onToggleFilters}
//             >
//               {showFilters ? "Hide" : "Show"} Filters
//               <FiChevronDown className={`chevron ${showFilters ? "rotated" : ""}`} />
//             </button>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// });

// const Stepper = React.memo(function Stepper({ steps, currentStep }) {
//   const progress = (currentStep / (steps.length - 1)) * 100;

//   return (
//     <div className="stepper-container">
//       <div className="progress-track">
//         <div 
//           className="progress-bar" 
//           style={{ width: `${progress}%` }}
//         />
//       </div>

//       <div className="step-items">
//         {steps.map((step, index) => (
//           <div 
//             key={index} 
//             className={`step-item ${
//               index < currentStep ? 'completed' : 
//               index === currentStep ? 'active' : 'pending'
//             }`}
//           >
//             <div className="step-indicator">
//               {index < currentStep ? <FiCheck /> : index + 1}
//             </div>
//             <div className="step-label">{step}</div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// });

// const FilterSidebar = React.memo(function FilterSidebar({ 
//   collapsed, 
//   filteredDoctors, 
//   formData, 
//   onSelectDoctor,
//   selectedSpecialty,
//   onSpecialtyChange,
//   selectedLocation,
//   onLocationChange,
//   onClearFilters
// }) {
//   const clearFilters = useCallback(() => {
//     onClearFilters();
//   }, [onClearFilters]);

//   return (
//     <aside className={`filter-sidebar ${collapsed ? 'collapsed' : 'expanded'}`}>
//       <div className="filter-section">
//         <div className="filter-header">
//           <h3>Filters</h3>
//           <button type="button" className="clear-filters" onClick={clearFilters}>
//             Reset All
//           </button>
//         </div>

//         <div className="filter-group">
//           <label className="filter-label">Specialty</label>
//           <select
//             value={selectedSpecialty}
//             onChange={onSpecialtyChange}
//             className="filter-select"
//           >
//             <option value="">All Specialties</option>
//             <option value="Cardiology">Cardiology</option>
//             <option value="Neurology">Neurology</option>
//             <option value="Orthopedics">Orthopedics</option>
//             <option value="Dermatology">Dermatology</option>
//             <option value="Pediatrics">Pediatrics</option>
//             <option value="Gynecology">Gynecology</option>
//           </select>
//         </div>

//         <div className="filter-group">
//           <label className="filter-label">Location</label>
//           <select
//             value={selectedLocation}
//             onChange={onLocationChange}
//             className="filter-select"
//           >
//             <option value="">All Locations</option>
//             <option value="Hyderabad">Hyderabad</option>
//             <option value="Vijayawada">Vijayawada</option>
//             <option value="Visakhapatnam">Visakhapatnam</option>
//             <option value="Guntur">Guntur</option>
//             <option value="Tirupati">Tirupati</option>
//           </select>
//         </div>
//       </div>

//       <div className="doctors-list">
//         <div className="doctors-header">
//           <h4>Available Doctors ({filteredDoctors.length})</h4>
//         </div>
        
//         <div className="doctors-scroll">
//           {filteredDoctors.length === 0 ? (
//             <div className="no-doctors">
//               <FiSearch className="no-doctors-icon" />
//               <p>No doctors match your search criteria</p>
//               <button className="clear-search-btn" onClick={clearFilters}>
//                 Clear all filters
//               </button>
//             </div>
//           ) : (
//             filteredDoctors.map(doctor => (
//               <DoctorCard
//                 key={doctor._id}
//                 doctor={doctor}
//                 isSelected={formData.doctorId === doctor._id}
//                 onSelect={() => onSelectDoctor(doctor._id)}
//               />
//             ))
//           )}
//         </div>
//       </div>
//     </aside>
//   );
// });

// const StepPanel = React.memo(function StepPanel({ children }) {
//   return (
//     <div className="step-panel">
//       <div className="step-content">{children}</div>
//     </div>
//   );
// });

// const SummarySidebar = React.memo(function SummarySidebar({ doctor, formData, files }) {
//   const consultationFee = doctor?.feePerConsultation || 0;

//   const services = [
//     { icon: FiVideo, title: "Video Consultation", desc: "HD quality video calls" },
//     { icon: FiFileText, title: "Digital Reports", desc: "Secure report sharing" },
//     { icon: FiShield, title: "Privacy Protected", desc: "End-to-end encryption" },
//     { icon: FiCalendar, title: "Flexible Scheduling", desc: "Book at your convenience" },
//   ];

//   return (
//     <aside className="summary-sidebar">
//       <div className="summary-card">
//         <div className="summary-header">
//           <h3>Appointment Summary</h3>
//           <p>Review your selection</p>
//         </div>

//         <div className="summary-details">
//           <div className="summary-item">
//             <div className="item-label">
//               <FiUser className="item-icon" />
//               Doctor
//             </div>
//             <div className="item-value">
//               {doctor ? `Dr. ${doctor.name}` : "Not selected"}
//             </div>
//           </div>

//           <div className="summary-item">
//             <div className="item-label">
//               <FiCalendar className="item-icon" />
//               Date & Time
//             </div>
//             <div className="item-value">
//               {formData.date && formData.time 
//                 ? `${formData.date} at ${formData.time}`
//                 : "Not scheduled"
//               }
//             </div>
//           </div>

//           <div className="summary-item">
//             <div className="item-label">
//               <FiVideo className="item-icon" />
//               Mode
//             </div>
//             <div className="item-value">
//               {formData.mode === 'online' ? 'Video Consultation' : 'In-Person Visit'}
//             </div>
//           </div>
//         </div>

//         <div className="fee-section">
//           <div className="fee-breakdown">
//             <div className="fee-item">
//               <span>Consultation Fee</span>
//               <span>₹{consultationFee}</span>
//             </div>
//             <div className="fee-item subtotal">
//               <span>Total</span>
//               <span>₹{consultationFee}</span>
//             </div>
//           </div>
//           <p className="fee-note">Platform and payment gateway charges may apply</p>
//         </div>
//       </div>

//       <div className="services-card">
//         <h4>What's Included</h4>
//         <div className="services-list">
//           {services.map((service, index) => {
//             const Icon = service.icon;
//             return (
//               <div key={index} className="service-item">
//                 <div className="service-icon">
//                   <Icon />
//                 </div>
//                 <div className="service-info">
//                   <h5>{service.title}</h5>
//                   <p>{service.desc}</p>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </aside>
//   );
// });

// const Toast = React.memo(function Toast({ type, message, onClose, autoClose = true }) {
//   useEffect(() => {
//     if (autoClose) {
//       const timer = setTimeout(onClose, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [autoClose, onClose]);

//   return (
//     <div className={`toast toast-${type}`}>
//       <div className="toast-icon">
//         {type === "success" ? <FiCheckCircle /> : <FiAlertTriangle />}
//       </div>
//       <div className="toast-content">
//         <p>{message}</p>
//       </div>
//       <button className="toast-close" onClick={onClose}>
//         <FiX />
//       </button>
//     </div>
//   );
// });

// // Memoized DoctorCard component
// const DoctorCard = React.memo(function DoctorCard({ doctor, isSelected, onSelect }) {
//   const getInitials = (name) => {
//     return (name || "DR")
//       .split(" ")
//       .map(n => n[0])
//       .slice(0, 2)
//       .join("")
//       .toUpperCase();
//   };

//   const fee = doctor.feePerConsultation || 500;
//   const rating = doctor.rating || 4.8;

//   return (
//     <motion.button
//       whileHover={{ y: -2 }}
//       whileTap={{ scale: 0.98 }}
//       type="button"
//       className={`doctor-card ${isSelected ? 'selected' : ''}`}
//       onClick={onSelect}
//     >
//       <div className="doctor-avatar">
//         {getInitials(doctor.name)}
//       </div>

//       <div className="doctor-info">
//         <h4 className="doctor-name">Dr. {doctor.name}</h4>
//         <p className="doctor-specialty">{doctor.specialization || "General Practice"}</p>
        
//         <div className="doctor-meta">
//           <span className="rating">
//             <FiStar className="star-icon" />
//             {rating}
//           </span>
//           <span className="location">
//             <FiMapPin className="location-icon" />
//             {doctor.location || "Remote"}
//           </span>
//         </div>

//         <div className="doctor-availability">
//           <span className={`availability-status ${doctor.available ? 'available' : 'busy'}`}>
//             {doctor.available ? 'Available' : 'Busy'}
//           </span>
//         </div>
//       </div>

//       <div className="doctor-fee">
//         <span className="fee-amount">₹{fee}</span>
//       </div>

//       {isSelected && (
//         <div className="selection-indicator">
//           <FiCheck />
//         </div>
//       )}
//     </motion.button>
//   );
// });

// export default function GetSecondOpinion() {
//   // State management - keeping your existing structure
//   const [formData, setFormData] = useState({
//     doctorId: "",
//     problem: "",
//     treatment: "",
//     date: "",
//     time: "",
//     mode: "online",
//   });
  
//   const [files, setFiles] = useState([]);
//   const [doctors, setDoctors] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState(null);
//   const [step, setStep] = useState(0);
//   const [appointmentDetails, setAppointmentDetails] = useState(null);
//   const [patientData, setPatientData] = useState(null);
  
//   // Filter states - using separate state to prevent re-render issues
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedSpecialty, setSelectedSpecialty] = useState("");
//   const [selectedLocation, setSelectedLocation] = useState("");
//   const [showFilters, setShowFilters] = useState(true);
//   const [sortBy, setSortBy] = useState("relevance");
  
//   // File handling
//   const [previews, setPreviews] = useState([]);
//   const fileInputRef = useRef(null);

//   const steps = ["Choose Doctor", "Medical Details", "Schedule", "Upload Reports"];
//   const isLastStep = step === steps.length - 1;

//   // Memoized filtered doctors to prevent unnecessary re-calculations
//   const filteredDoctors = useMemo(() => {
//     if (!doctors || doctors.length === 0) return [];

//     let result = [...doctors];
    
//     // Apply search filter
//     if (searchQuery.trim()) {
//       const query = searchQuery.toLowerCase().trim();
//       result = result.filter(doctor =>
//         (doctor.name || "").toLowerCase().includes(query) ||
//         (doctor.specialization || "").toLowerCase().includes(query) ||
//         (doctor.location || "").toLowerCase().includes(query)
//       );
//     }
    
//     // Apply specialty filter
//     if (selectedSpecialty) {
//       result = result.filter(doctor => doctor.specialization === selectedSpecialty);
//     }
    
//     // Apply location filter
//     if (selectedLocation) {
//       result = result.filter(doctor => 
//         doctor.location && 
//         doctor.location.toLowerCase().includes(selectedLocation.toLowerCase())
//       );
//     }

//     // Apply sorting
//     switch (sortBy) {
//       case "fee-asc":
//         result.sort((a, b) => (a.feePerConsultation || 0) - (b.feePerConsultation || 0));
//         break;
//       case "fee-desc":
//         result.sort((a, b) => (b.feePerConsultation || 0) - (a.feePerConsultation || 0));
//         break;
//       case "name":
//         result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
//         break;
//       default:
//         // relevance - no sorting needed
//         break;
//     }

//     return result;
//   }, [doctors, searchQuery, selectedSpecialty, selectedLocation, sortBy]);

//   // Data fetching functions - keeping your existing API calls
//   const fetchPatientData = async () => {
//     try {
//       const res = await axios.get("http://localhost:1600/api/patient/me", { 
//         withCredentials: true 
//       });
//       setPatientData(res.data?.data || null);
//     } catch {
//       setPatientData(null);
//     }
//   };

//   const fetchDoctors = async () => {
//     try {
//       const res = await axios.get("http://localhost:1600/api/doctor");
//       const list = res.data?.data || [];
//       setDoctors(list);
//     } catch {
//       setMessage({ 
//         type: "error", 
//         text: "Could not load doctors. Please refresh the page." 
//       });
//     }
//   };

//   // Effects - keeping your existing logic
//   useEffect(() => {
//     fetchPatientData();
//     fetchDoctors();
//   }, []);

//   useEffect(() => {
//     updatePreviews();
//     return () => cleanupPreviews();
//   }, [files]);

//   const updatePreviews = () => {
//     cleanupPreviews();
//     const newPreviews = files.map(file => ({
//       url: file.type.includes("image") ? URL.createObjectURL(file) : null,
//       name: file.name,
//       size: file.size,
//       type: file.type,
//     }));
//     setPreviews(newPreviews);
//   };

//   const cleanupPreviews = () => {
//     previews.forEach(preview => {
//       if (preview.url) URL.revokeObjectURL(preview.url);
//     });
//   };

//   // Handler functions - memoized to prevent re-renders and maintain input focus
//   const handleInputChange = useCallback((e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   }, []);

//   const handleSearchInputChange = useCallback((e) => {
//     setSearchQuery(e.target.value);
//   }, []);

//   const handleClearSearch = useCallback(() => {
//     setSearchQuery("");
//   }, []);

//   const handleSortChange = useCallback((e) => {
//     setSortBy(e.target.value);
//   }, []);

//   const handleToggleFilters = useCallback(() => {
//     setShowFilters(prev => !prev);
//   }, []);

//   const handleSpecialtyChange = useCallback((e) => {
//     setSelectedSpecialty(e.target.value);
//   }, []);

//   const handleLocationChange = useCallback((e) => {
//     setSelectedLocation(e.target.value);
//   }, []);

//   const handleClearFilters = useCallback(() => {
//     setSearchQuery("");
//     setSelectedSpecialty("");
//     setSelectedLocation("");
//   }, []);

//   const handleFileChange = useCallback((e) => {
//     const selectedFiles = Array.from(e.target.files || []);
//     processFiles(selectedFiles);
//   }, []);

//   const handleFileDrop = useCallback((e) => {
//     e.preventDefault();
//     const droppedFiles = Array.from(e.dataTransfer.files || []);
//     processFiles(droppedFiles);
//   }, []);

//   const processFiles = (fileList) => {
//     const maxSize = 10 * 1024 * 1024; // 10MB
//     const acceptedFiles = fileList.filter(file => file.size <= maxSize);
//     const rejectedFiles = fileList.filter(file => file.size > maxSize);
    
//     if (rejectedFiles.length > 0) {
//       setMessage({
//         type: "error",
//         text: `${rejectedFiles.length} file(s) exceed 10MB limit and were skipped.`
//       });
//       setTimeout(() => setMessage(null), 3500);
//     }
    
//     if (acceptedFiles.length > 0) {
//       setFiles(prev => [...prev, ...acceptedFiles]);
//     }
//   };

//   const removeFile = (index) => {
//     setFiles(prev => prev.filter((_, i) => i !== index));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validation - keeping your existing validation logic
//     const requiredFields = ['doctorId', 'problem', 'treatment', 'date', 'time'];
//     const missingFields = requiredFields.filter(field => !formData[field]);
    
//     if (missingFields.length > 0) {
//       setMessage({ 
//         type: "error", 
//         text: "Please fill all required fields." 
//       });
//       return;
//     }
    
//     if (files.length === 0) {
//       setMessage({ 
//         type: "error", 
//         text: "Please upload at least one medical report." 
//       });
//       return;
//     }

//     setLoading(true);
//     setMessage(null);

//     const payload = new FormData();
//     Object.entries(formData).forEach(([key, value]) => {
//       payload.append(key, value);
//     });
//     files.forEach(file => payload.append("files", file));

//     try {
//       const response = await axios.post(
//         "http://localhost:1600/api/patient/get-second-opinion", 
//         payload,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );

//       setMessage({ 
//         type: "success", 
//         text: response.data?.message || "Request submitted successfully!" 
//       });

//       const selectedDoctor = doctors.find(d => d._id === formData.doctorId);
//       setAppointmentDetails({
//         _id: response.data.data?._id || "",
//         email: patientData?.email || "",
//         doctorName: selectedDoctor?.name || "",
//         date: formData.date,
//         price: selectedDoctor?.feePerConsultation || 500,
//       });

//       // Reset form
//       if (fileInputRef.current) fileInputRef.current.value = null;
//       setStep(0);
//     } catch (error) {
//       setMessage({ 
//         type: "error", 
//         text: error.response?.data?.message || "Submission failed. Please try logging in first." 
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const nextStep = () => setStep(prev => Math.min(steps.length - 1, prev + 1));
//   const prevStep = () => setStep(prev => Math.max(0, prev - 1));

//   const renderStepContent = () => {
//     switch (step) {
//       case 0:
//         return (
//           <StepPanel>
//             <div className="step-header">
//               <h2>Choose Your Specialist</h2>
//               <p>Browse through our network of qualified specialists and select the doctor best suited for your case.</p>
//             </div>
            
//             <div className="featured-doctors">
//               {doctors.slice(0, 3).map(doctor => (
//                 <div key={doctor._id} className="featured-doctor-card">
//                   <div className="fd-avatar">
//                     {(doctor.name || "DR").split(" ").map(n => n[0]).slice(0,2).join("")}
//                   </div>
//                   <div className="fd-info">
//                     <h4>Dr. {doctor.name}</h4>
//                     <p>{doctor.specialization || "General Practice"}</p>
//                     <span className="fd-fee">₹{doctor.feePerConsultation || 500}</span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </StepPanel>
//         );

//       case 1:
//         return (
//           <StepPanel>
//             <div className="step-header">
//               <h2>Medical Details</h2>
//               <p>Provide detailed information about your medical condition and previous treatments.</p>
//             </div>

//             <div className="form-group">
//               <label className="form-label">
//                 Describe Your Medical Concern *
//               </label>
//               <textarea
//                 name="problem"
//                 value={formData.problem}
//                 onChange={handleInputChange}
//                 placeholder="Please describe your symptoms, duration, severity, and any other relevant details..."
//                 className="form-textarea"
//                 rows={4}
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label className="form-label">
//                 Previous Treatments & Medications *
//               </label>
//               <textarea
//                 name="treatment"
//                 value={formData.treatment}
//                 onChange={handleInputChange}
//                 placeholder="List any medications, surgeries, investigations, or treatments you've had..."
//                 className="form-textarea"
//                 rows={4}
//                 required
//               />
//             </div>
//           </StepPanel>
//         );

//       case 2:
//         return (
//           <StepPanel>
//             <div className="step-header">
//               <h2>Schedule Appointment</h2>
//               <p>Choose your preferred date, time, and consultation mode.</p>
//             </div>

//             <div className="schedule-grid">
//               <div className="form-group">
//                 <label className="form-label">
//                   <FiVideo className="label-icon" />
//                   Consultation Mode *
//                 </label>
//                 <select
//                   name="mode"
//                   value={formData.mode}
//                   onChange={handleInputChange}
//                   className="form-select"
//                   required
//                 >
//                   <option value="online">Video Consultation</option>
//                   <option value="offline">In-Person Visit</option>
//                 </select>
//               </div>

//               <div className="form-group">
//                 <label className="form-label">
//                   <FiCalendar className="label-icon" />
//                   Preferred Date *
//                 </label>
//                 <input
//                   type="date"
//                   name="date"
//                   value={formData.date}
//                   onChange={handleInputChange}
//                   className="form-input"
//                   min={new Date().toISOString().split('T')[0]}
//                   required
//                 />
//               </div>

//               <div className="form-group">
//                 <label className="form-label">
//                   <FiClock className="label-icon" />
//                   Preferred Time *
//                 </label>
//                 <input
//                   type="time"
//                   name="time"
//                   value={formData.time}
//                   onChange={handleInputChange}
//                   className="form-input"
//                   required
//                 />
//               </div>
//             </div>
//           </StepPanel>
//         );

//       case 3:
//         return (
//           <StepPanel>
//             <div className="step-header">
//               <h2>Upload Medical Reports</h2>
//               <p>Upload your medical reports, test results, and relevant documents for review.</p>
//             </div>

//             <div
//               className="file-upload-area"
//               onDragOver={(e) => e.preventDefault()}
//               onDrop={handleFileDrop}
//               onClick={() => fileInputRef.current?.click()}
//             >
//               <FiUpload className="upload-icon" />
//               <div className="upload-text">
//                 <h3>Drop files here or click to browse</h3>
//                 <p>Supports JPG, PNG, PDF • Maximum 10MB per file</p>
//               </div>
//             </div>

//             <input
//               ref={fileInputRef}
//               type="file"
//               multiple
//               accept=".jpg,.jpeg,.png,.pdf"
//               onChange={handleFileChange}
//               style={{ display: "none" }}
//             />

//             {previews.length > 0 && (
//               <div className="uploaded-files">
//                 <h4>Uploaded Files ({files.length})</h4>
//                 <div className="file-list">
//                   {previews.map((preview, index) => (
//                     <div key={index} className="file-item">
//                       <div className="file-preview">
//                         {preview.url ? (
//                           <img src={preview.url} alt={preview.name} />
//                         ) : (
//                           <div className="file-placeholder">
//                             <span>PDF</span>
//                           </div>
//                         )}
//                       </div>
                      
//                       <div className="file-details">
//                         <h5>{preview.name}</h5>
//                         <p>{(preview.size / 1024 / 1024).toFixed(2)} MB</p>
//                       </div>
                      
//                       <button
//                         type="button"
//                         className="remove-file"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           removeFile(index);
//                         }}
//                       >
//                         <FiTrash2 />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </StepPanel>
//         );

//       default:
//         return null;
//     }
//   };

//   if (appointmentDetails) {
//     return <Payment appointment={appointmentDetails} />;
//   }

//   return (
//     <>
//       <StyleBlock />
      
//       <div className="second-opinion-container">
//         <form className="so-form" onSubmit={handleSubmit}>
//           <HeroSection 
//             searchQuery={searchQuery}
//             onSearchChange={handleSearchInputChange}
//             onClearSearch={handleClearSearch}
//             sortBy={sortBy}
//             onSortChange={handleSortChange}
//             showFilters={showFilters}
//             onToggleFilters={handleToggleFilters}
//           />

//           <Stepper steps={steps} currentStep={step} />

//           <div className="so-layout">
//             <FilterSidebar 
//               collapsed={!showFilters}
//               filteredDoctors={filteredDoctors}
//               formData={formData}
//               onSelectDoctor={(doctorId) => setFormData(prev => ({ ...prev, doctorId }))}
//               selectedSpecialty={selectedSpecialty}
//               onSpecialtyChange={handleSpecialtyChange}
//               selectedLocation={selectedLocation}
//               onLocationChange={handleLocationChange}
//               onClearFilters={handleClearFilters}
//             />

//             <main className="so-main">
//               <AnimatePresence mode="wait">
//                 <motion.div
//                   key={step}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -10 }}
//                   transition={{ duration: 0.3 }}
//                 >
//                   {renderStepContent()}
//                 </motion.div>
//               </AnimatePresence>

//               <div className="navigation-buttons">
//                 <button
//                   type="button"
//                   className={`nav-btn prev-btn ${step === 0 || loading ? 'disabled' : ''}`}
//                   onClick={prevStep}
//                   disabled={step === 0 || loading}
//                 >
//                   <FiArrowLeft /> Back
//                 </button>

//                 {!isLastStep ? (
//                   <button
//                     type="button"
//                     className="nav-btn next-btn"
//                     onClick={nextStep}
//                   >
//                     Next <FiArrowRight />
//                   </button>
//                 ) : (
//                   <button
//                     type="submit"
//                     className="nav-btn submit-btn"
//                     disabled={loading}
//                   >
//                     {loading ? (
//                       <>
//                         <FiLoader className="spinner" /> Processing...
//                       </>
//                     ) : (
//                       <>
//                         Book Consultation <FiArrowRight />
//                       </>
//                     )}
//                   </button>
//                 )}
//               </div>
//             </main>

//             <SummarySidebar 
//               doctor={doctors.find(d => d._id === formData.doctorId)} 
//               formData={formData} 
//               files={files}
//             />
//           </div>

//           {message && (
//             <Toast
//               type={message.type}
//               message={message.text}
//               onClose={() => setMessage(null)}
//             />
//           )}
//         </form>
//       </div>
//     </>
//   );
// }















































import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUpload,
  FiLoader,
  FiAlertTriangle,
  FiCheckCircle,
  FiArrowRight,
  FiArrowLeft,
  FiSearch,
  FiX,
  FiChevronDown,
  FiCheck,
  FiStar,
  FiMapPin,
  FiUser,
  FiCalendar,
  FiVideo,
  FiClock,
  FiFileText,
  FiShield,
  FiTrash2,
} from "react-icons/fi";

import Payment from "../../payments/Payment";

// Debounce utility for smooth search without re-rendering on every keystroke
function useDebouncedValue(value, delay = 250) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// Keep your existing StyleBlock CSS exactly as-is
const StyleBlock = React.memo(function StyleBlock() {
  return (
    <style jsx>{`
      /* Reset and Base Styles */
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      :root {
        --primary-50: #ecfeff;
        --primary-100: #cffafe;
        --primary-500: #06b6d4;
        --primary-600: #0891b2;
        --primary-700: #0e7490;
        --success-50: #f0fdf4;
        --success-500: #22c55e;
        --success-600: #16a34a;
        --error-50: #fef2f2;
        --error-500: #ef4444;
        --error-600: #dc2626;
        --gray-50: #f8fafc;
        --gray-100: #f1f5f9;
        --gray-200: #e2e8f0;
        --gray-300: #cbd5e1;
        --gray-400: #94a3b8;
        --gray-500: #64748b;
        --gray-600: #475569;
        --gray-700: #334155;
        --gray-800: #1e293b;
        --gray-900: #0f172a;
        --space-xs: 0.25rem;
        --space-sm: 0.5rem;
        --space-md: 1rem;
        --space-lg: 1.5rem;
        --space-xl: 2rem;
        --space-2xl: 3rem;
        --font-sm: 0.875rem;
        --font-base: 1rem;
        --font-lg: 1.125rem;
        --font-xl: 1.25rem;
        --font-2xl: 1.5rem;
        --font-3xl: 1.875rem;
        --radius-sm: 0.375rem;
        --radius-md: 0.5rem;
        --radius-lg: 0.75rem;
        --radius-xl: 1rem;
        --radius-2xl: 1.5rem;
        --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
        --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
        --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
        --transition-fast: 150ms ease-in-out;
        --transition-base: 200ms ease-in-out;
        --transition-slow: 300ms ease-in-out;
      }

      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.5;
        color: var(--gray-900);
        background: linear-gradient(to bottom, #f0f9ff 0%, #ffffff 100%);
        min-height: 100vh;
      }

      .second-opinion-container {
        max-width: 1440px;
        margin: 0 auto;
        padding: var(--space-xl);
        min-height: 100vh;
      }

      .so-form {
        display: flex;
        flex-direction: column;
        gap: var(--space-xl);
      }

      /* Enhanced Hero Section */
      .hero-section {
        background: linear-gradient(135deg, rgba(6, 182, 212, 0.05) 0%, rgba(255, 255, 255, 0.9) 100%);
        border-radius: var(--radius-xl);
        padding: var(--space-2xl);
        border: 1px solid var(--gray-200);
        position: relative;
        overflow: hidden;
      }

      .hero-section::before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
        pointer-events: none;
      }

      .hero-content {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: var(--space-2xl);
        align-items: center;
        position: relative;
        z-index: 1;
      }

      .hero-text {
        max-width: 700px;
      }

      .hero-title {
        font-size: 2rem;
        font-weight: 700;
        color: #0c4a6e;
        margin-bottom: var(--space-md);
        line-height: 1.2;
        letter-spacing: -0.01em;
      }

      .hero-description {
        font-size: var(--font-base);
        color: var(--gray-600);
        line-height: 1.6;
        font-weight: 400;
      }

      .hero-controls {
        display: flex;
        flex-direction: column;
        gap: var(--space-md);
        min-width: 420px;
      }

      /* Enhanced Search Container */
      .search-container {
        display: flex;
        align-items: center;
        background: white;
        border-radius: var(--radius-lg);
        padding: var(--space-md);
        box-shadow: var(--shadow-sm);
        border: 1px solid var(--gray-200);
        transition: all var(--transition-base);
        position: relative;
      }

      .search-container:focus-within {
        border-color: var(--primary-500);
        box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
      }

      .search-icon {
        color: var(--gray-400);
        margin-right: var(--space-md);
        flex-shrink: 0;
        font-size: 1.1rem;
        transition: var(--transition-fast);
      }

      .search-container:focus-within .search-icon {
        color: var(--primary-500);
      }

      .search-input {
        flex: 1;
        border: none;
        outline: none;
        font-size: 0.875rem;
        background: transparent;
        font-weight: 400;
        color: var(--gray-700);
        line-height: 1.5;
      }

      .search-input::placeholder {
        color: var(--gray-400);
        font-weight: 400;
      }

      .clear-search {
        background: var(--gray-100);
        border: none;
        color: var(--gray-500);
        cursor: pointer;
        padding: var(--space-sm);
        border-radius: 50%;
        transition: var(--transition-fast);
        margin-left: var(--space-sm);
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .clear-search:hover {
        background: var(--gray-200);
        color: var(--gray-700);
      }

      .control-row {
        display: flex;
        gap: var(--space-md);
        align-items: center;
      }

      .sort-select {
        flex: 1;
        padding: var(--space-md);
        border: 1px solid var(--gray-200);
        border-radius: var(--radius-md);
        background: white;
        font-size: var(--font-sm);
        font-weight: 400;
        cursor: pointer;
        box-shadow: var(--shadow-sm);
        transition: var(--transition-base);
      }

      .sort-select:focus {
        outline: none;
        border-color: var(--primary-500);
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }

      .filter-toggle {
        display: flex;
        align-items: center;
        gap: var(--space-sm);
        padding: var(--space-md);
        background: white;
        border: 1px solid var(--gray-200);
        border-radius: var(--radius-md);
        cursor: pointer;
        font-size: var(--font-sm);
        font-weight: 500;
        color: var(--primary-600);
        transition: var(--transition-base);
        box-shadow: var(--shadow-sm);
      }

      .filter-toggle:hover {
        background: var(--primary-50);
        border-color: var(--primary-500);
      }

      .chevron {
        transition: transform var(--transition-fast);
      }

      .chevron.rotated {
        transform: rotate(180deg);
      }

      /* Stepper */
      .stepper-container {
        background: white;
        border-radius: var(--radius-lg);
        padding: var(--space-lg);
        box-shadow: var(--shadow-sm);
        border: 1px solid var(--gray-200);
      }

      .progress-track {
        height: 4px;
        background: var(--gray-200);
        border-radius: 999px;
        overflow: hidden;
        margin-bottom: var(--space-lg);
      }

      .progress-bar {
        height: 100%;
        background: linear-gradient(90deg, var(--primary-500), var(--primary-600));
        border-radius: 999px;
        transition: width var(--transition-slow);
      }

      .step-items {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: var(--space-lg);
      }

      .step-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: var(--space-md);
      }

      .step-indicator {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 0.875rem;
        border: 2px solid var(--gray-300);
        background: white;
        color: var(--gray-500);
        transition: var(--transition-base);
      }

      .step-item.active .step-indicator {
        background: var(--primary-500);
        color: white;
        border-color: var(--primary-500);
      }

      .step-item.completed .step-indicator {
        background: var(--success-500);
        color: white;
        border-color: var(--success-500);
      }

      .step-label {
        font-size: var(--font-sm);
        font-weight: 500;
        color: var(--gray-600);
        max-width: 150px;
      }

      .step-item.active .step-label {
        color: var(--primary-600);
        font-weight: 600;
      }

      .step-item.completed .step-label {
        color: var(--success-600);
      }

      /* Layout */
      .so-layout {
        display: grid;
        grid-template-columns: 280px 1fr 320px;
        gap: var(--space-lg);
        align-items: start;
      }

      @media (max-width: 1200px) {
        .so-layout {
          grid-template-columns: 280px 1fr 300px;
          gap: var(--space-lg);
        }
      }

      @media (max-width: 1024px) {
        .so-layout {
          grid-template-columns: 1fr;
          gap: var(--space-lg);
        }
        
        .filter-sidebar {
          order: 2;
        }
        
        .so-main {
          order: 1;
        }
        
        .summary-sidebar {
          order: 3;
        }
      }

      /* Enhanced Filter Sidebar */
      .filter-sidebar {
        background: white;
        border-radius: var(--radius-lg);
        border: 1px solid var(--gray-200);
        box-shadow: var(--shadow-sm);
        overflow: hidden;
        transition: var(--transition-base);
      }

      .filter-sidebar.collapsed {
        display: none;
      }

      .filter-section {
        padding: var(--space-lg);
        border-bottom: 1px solid var(--gray-200);
      }

      .filter-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--space-lg);
      }

      .filter-header h3 {
        font-size: var(--font-base);
        font-weight: 600;
        color: var(--gray-900);
      }

      .clear-filters {
        background: none;
        border: none;
        color: var(--primary-600);
        font-size: var(--font-sm);
        font-weight: 500;
        cursor: pointer;
        padding: var(--space-xs) var(--space-sm);
        border-radius: var(--radius-sm);
        transition: var(--transition-fast);
      }

      .clear-filters:hover {
        background: var(--primary-50);
      }

      .filter-group {
        margin-bottom: var(--space-lg);
      }

      .filter-label {
        display: block;
        font-size: var(--font-sm);
        font-weight: 500;
        color: var(--gray-700);
        margin-bottom: var(--space-sm);
      }

      .filter-select {
        width: 100%;
        padding: var(--space-md);
        border: 1px solid var(--gray-300);
        border-radius: var(--radius-md);
        font-size: var(--font-sm);
        background: white;
        cursor: pointer;
        transition: var(--transition-fast);
      }

      .filter-select:focus {
        outline: none;
        border-color: var(--primary-500);
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }

      .doctors-list {
        padding: var(--space-lg) 0;
        
      }

      .doctors-header {
        padding: 0 var(--space-lg);
        margin-bottom: var(--space-md);
      }

      .doctors-header h4 {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--gray-900);
        margin-bottom: var(--space-sm);
      }

      .doctors-scroll {
        max-height: 500px;
        overflow-y: auto;
        padding: 0 var(--space-lg);
      }

      .doctors-scroll::-webkit-scrollbar {
        width: 4px;
      }

      .doctors-scroll::-webkit-scrollbar-track {
        background: var(--gray-100);
      }

      .doctors-scroll::-webkit-scrollbar-thumb {
        background: var(--gray-300);
        border-radius: 999px;
      }

      /* Enhanced No Doctors State */
      .no-doctors {
        text-align: center;
        padding: var(--space-2xl);
        color: var(--gray-500);
      }

      .no-doctors-icon {
        font-size: 2rem;
        color: var(--gray-400);
        margin-bottom: var(--space-md);
      }

      .clear-search-btn {
        margin-top: var(--space-md);
        padding: var(--space-sm) var(--space-md);
        background: var(--primary-500);
        color: white;
        border: none;
        border-radius: var(--radius-md);
        cursor: pointer;
        font-size: var(--font-sm);
        transition: var(--transition-fast);
      }

      .clear-search-btn:hover {
        background: var(--primary-600);
      }

      /* Doctor Card */
      .doctor-card {
        display: flex;
        align-items: center;
        gap: var(--space-md);
        width: 100%;
        padding: var(--space-md);
        margin-bottom: var(--space-sm);
        background: white;
        border: 2px solid transparent;
        border-radius: var(--radius-lg);
        cursor: pointer;
        transition: var(--transition-base);
        position: relative;
        text-align: left;
      }

      .doctor-card:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
        border-color: var(--gray-200);
      }

      .doctor-card.selected {
        border-color: var(--primary-500);
        background: linear-gradient(135deg, var(--primary-50), rgba(255, 255, 255, 0.8));
      }

      .doctor-avatar {
        width: 44px;
        height: 44px;
        border-radius: var(--radius-md);
        background: linear-gradient(135deg, #0891b2, #06b6d4);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 0.8125rem;
        flex-shrink: 0;
      }

      .doctor-info {
        flex: 1;
        min-width: 0;
      }

      .doctor-name {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--gray-900);
        margin: 0 0 var(--space-xs) 0;
      }

      .doctor-specialty {
        font-size: var(--font-sm);
        color: var(--gray-600);
        margin: 0 0 var(--space-sm) 0;
      }

      .doctor-meta {
        display: flex;
        align-items: center;
        gap: var(--space-md);
        font-size: var(--font-sm);
      }

      .rating {
        display: flex;
        align-items: center;
        gap: var(--space-xs);
        color: var(--gray-600);
      }

      .star-icon {
        color: #fbbf24;
      }

      .location {
        display: flex;
        align-items: center;
        gap: var(--space-xs);
        color: var(--gray-600);
      }

      .location-icon {
        color: var(--gray-400);
      }

      .doctor-availability {
        margin-top: var(--space-sm);
      }

      .availability-status {
        padding: var(--space-xs) var(--space-sm);
        border-radius: var(--radius-sm);
        font-size: 0.75rem;
        font-weight: 500;
      }

      .availability-status.available {
        background: var(--success-50);
        color: var(--success-600);
      }

      .availability-status.busy {
        background: var(--gray-100);
        color: var(--gray-600);
      }

      .doctor-fee {
        text-align: right;
        flex-shrink: 0;
      }

      .fee-amount {
        display: block;
        font-size: var(--font-base);
        font-weight: 700;
        color: #0c4a6e;
      }

      .fee-label {
        font-size: var(--font-sm);
        color: var(--gray-500);
      }

      .selection-indicator {
        position: absolute;
        top: var(--space-md);
        right: var(--space-md);
        width: 24px;
        height: 24px;
        background: var(--success-500);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
      }

      /* Main Content Area */
      .so-main {
        background: white;
        border-radius: var(--radius-lg);
        border: 1px solid var(--gray-200);
        box-shadow: var(--shadow-sm);
        overflow: hidden;
      }

      .step-panel {
        padding: var(--space-xl);
        min-height: 450px;
      }

      .step-content {
        max-width: 100%;
      }

      .step-header {
        margin-bottom: var(--space-2xl);
      }

      .step-header h2 {
        font-size: var(--font-xl);
        font-weight: 600;
        color: #0c4a6e;
        margin-bottom: var(--space-sm);
      }

      .step-header p {
        font-size: var(--font-base);
        color: var(--gray-600);
        line-height: 1.6;
      }

      /* Featured Doctors */
      .featured-doctors {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: var(--space-lg);
      }

      .featured-doctor-card {
        display: flex;
        align-items: center;
        gap: var(--space-md);
        padding: var(--space-lg);
        background: var(--gray-50);
        border-radius: var(--radius-lg);
        border: 1px solid var(--gray-200);
      }

      .fd-avatar {
        width: 56px;
        height: 56px;
        border-radius: var(--radius-lg);
        background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: var(--font-base);
      }

      .fd-info h4 {
        font-size: var(--font-base);
        font-weight: 600;
        color: var(--gray-900);
        margin: 0 0 var(--space-xs) 0;
      }

      .fd-info p {
        font-size: var(--font-sm);
        color: var(--gray-600);
        margin: 0 0 var(--space-sm) 0;
      }

      .fd-fee {
        font-size: var(--font-sm);
        font-weight: 600;
        color: var(--primary-600);
        background: var(--primary-50);
        padding: var(--space-xs) var(--space-sm);
        border-radius: var(--radius-sm);
      }

      /* Form Styles */
      .form-group {
        margin-bottom: var(--space-xl);
      }

      .form-label {
        display: flex;
        align-items: center;
        gap: var(--space-sm);
        font-size: var(--font-sm);
        font-weight: 600;
        color: var(--gray-700);
        margin-bottom: var(--space-sm);
      }

      .label-icon {
        color: var(--primary-500);
      }

      .form-textarea,
      .form-input,
      .form-select {
        width: 100%;
        padding: var(--space-md);
        border: 1px solid var(--gray-300);
        border-radius: var(--radius-md);
        font-size: var(--font-base);
        font-family: inherit;
        transition: var(--transition-fast);
        background: white;
      }

      .form-textarea {
        resize: vertical;
        min-height: 120px;
      }

      .form-textarea:focus,
      .form-input:focus,
      .form-select:focus {
        outline: none;
        border-color: var(--primary-500);
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }

      .form-textarea::placeholder,
      .form-input::placeholder {
        color: var(--gray-400);
      }

      .schedule-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: var(--space-lg);
      }

      /* File Upload */
      .file-upload-area {
        border: 2px dashed var(--gray-300);
        border-radius: var(--radius-lg);
        padding: var(--space-2xl);
        text-align: center;
        cursor: pointer;
        transition: var(--transition-base);
        background: var(--gray-50);
      }

      .file-upload-area:hover {
        border-color: var(--primary-500);
        background: var(--primary-50);
      }

      .upload-icon {
        font-size: 48px;
        color: var(--primary-500);
        margin-bottom: var(--space-lg);
      }

      .upload-text h3 {
        font-size: var(--font-lg);
        font-weight: 600;
        color: var(--gray-900);
        margin-bottom: var(--space-sm);
      }

      .upload-text p {
        font-size: var(--font-sm);
        color: var(--gray-600);
      }

      .uploaded-files {
        margin-top: var(--space-xl);
      }

      .uploaded-files h4 {
        font-size: var(--font-base);
        font-weight: 600;
        color: var(--gray-900);
        margin-bottom: var(--space-lg);
      }

      .file-list {
        display: flex;
        flex-direction: column;
        gap: var(--space-md);
      }

      .file-item {
        display: flex;
        align-items: center;
        gap: var(--space-md);
        padding: var(--space-md);
        background: var(--gray-50);
        border-radius: var(--radius-md);
        border: 1px solid var(--gray-200);
      }

      .file-preview {
        width: 64px;
        height: 64px;
        border-radius: var(--radius-md);
        overflow: hidden;
        flex-shrink: 0;
        background: var(--gray-200);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .file-preview img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .file-placeholder {
        background: var(--primary-100);
        color: var(--primary-600);
        font-weight: 600;
        font-size: var(--font-sm);
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .file-details {
        flex: 1;
        min-width: 0;
      }

      .file-details h5 {
        font-size: var(--font-sm);
        font-weight: 600;
        color: var(--gray-900);
        margin: 0 0 var(--space-xs) 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .file-details p {
        font-size: var(--font-sm);
        color: var(--gray-600);
        margin: 0;
      }

      .remove-file {
        background: var(--error-50);
        color: var(--error-600);
        border: none;
        border-radius: var(--radius-sm);
        padding: var(--space-sm);
        cursor: pointer;
        transition: var(--transition-fast);
        flex-shrink: 0;
      }

      .remove-file:hover {
        background: var(--error-100);
      }

      /* Navigation Buttons */
      .navigation-buttons {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--space-xl);
        border-top: 1px solid var(--gray-200);
        background: var(--gray-50);
      }

      .nav-btn {
        display: flex;
        align-items: center;
        gap: var(--space-sm);
        padding: var(--space-md) var(--space-lg);
        border-radius: var(--radius-lg);
        font-size: var(--font-base);
        font-weight: 600;
        cursor: pointer;
        transition: var(--transition-base);
        border: none;
        text-decoration: none;
      }

      .prev-btn {
        background: white;
        color: var(--gray-700);
        border: 1px solid var(--gray-300);
      }

      .prev-btn:hover:not(.disabled) {
        background: var(--gray-50);
        border-color: var(--gray-400);
      }

      .next-btn {
        background: var(--primary-500);
        color: white;
        border: 1px solid var(--primary-500);
      }

      .next-btn:hover {
        background: var(--primary-600);
        border-color: var(--primary-600);
      }

      .submit-btn {
        background: linear-gradient(135deg, var(--success-500), var(--success-600));
        color: white;
        border: none;
      }

      .submit-btn:hover:not(:disabled) {
        background: linear-gradient(135deg, var(--success-600), var(--success-700));
        transform: translateY(-1px);
        box-shadow: var(--shadow-lg);
      }

      .nav-btn.disabled {
        opacity: 0.5;
        cursor: not-allowed;
        pointer-events: none;
      }

      .spinner {
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      /* Summary Sidebar */
      .summary-sidebar {
        display: flex;
        flex-direction: column;
        gap: var(--space-lg);
      }

      .summary-card {
        background: white;
        border-radius: var(--radius-lg);
        border: 1px solid var(--gray-200);
        box-shadow: var(--shadow-sm);
        overflow: hidden;
      }

      .summary-header {
        padding: var(--space-lg);
        border-bottom: 1px solid var(--gray-200);
        background: linear-gradient(135deg, rgba(6, 182, 212, 0.03), rgba(255, 255, 255, 1));
      }

      .summary-header h3 {
        font-size: var(--font-base);
        font-weight: 600;
        color: #0c4a6e;
        margin: 0 0 var(--space-xs) 0;
      }

      .summary-header p {
        font-size: var(--font-sm);
        color: var(--gray-600);
        margin: 0;
      }

      .summary-details {
        padding: var(--space-lg);
      }

      .summary-item {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: var(--space-md);
        margin-bottom: var(--space-lg);
        padding-bottom: var(--space-lg);
        border-bottom: 1px solid var(--gray-100);
      }

      .summary-item:last-child {
        margin-bottom: 0;
        padding-bottom: 0;
        border-bottom: none;
      }

      .item-label {
        display: flex;
        align-items: center;
        gap: var(--space-sm);
        font-size: var(--font-sm);
        font-weight: 500;
        color: var(--gray-600);
        min-width: 80px;
      }

      .item-icon {
        color: var(--primary-500);
      }

      .item-value {
        font-size: var(--font-sm);
        font-weight: 600;
        color: var(--gray-900);
        text-align: right;
        flex: 1;
      }

      .fee-section {
        background: #f0f9ff;
        padding: var(--space-lg);
        border-top: 1px solid var(--gray-200);
      }

      .fee-breakdown {
        margin-bottom: var(--space-md);
      }

      .fee-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--space-sm);
        font-size: var(--font-sm);
      }

      .fee-item.subtotal {
        padding-top: var(--space-md);
        border-top: 1px solid var(--gray-200);
        font-weight: 700;
        font-size: var(--font-base);
        color: var(--gray-900);
      }

      .fee-note {
        font-size: 0.75rem;
        color: var(--gray-500);
        margin: 0 0 var(--space-lg) 0;
        line-height: 1.4;
      }

      .quick-actions {
        display: flex;
        gap: var(--space-sm);
      }

      .quick-btn {
        flex: 1;
        padding: var(--space-sm) var(--space-md);
        border: 1px solid var(--primary-200);
        background: var(--primary-50);
        color: var(--primary-600);
        border-radius: var(--radius-md);
        font-size: var(--font-sm);
        font-weight: 500;
        cursor: pointer;
        transition: var(--transition-fast);
      }

      .quick-btn:hover {
        background: var(--primary-100);
        border-color: var(--primary-300);
      }

      .services-card {
        background: white;
        border-radius: var(--radius-lg);
        border: 1px solid var(--gray-200);
        box-shadow: var(--shadow-sm);
        padding: var(--space-lg);
      }

      .services-card h4 {
        font-size: 0.875rem;
        font-weight: 600;
        color: #0c4a6e;
        margin: 0 0 var(--space-md) 0;
      }

      .services-list {
        display: flex;
        flex-direction: column;
        gap: var(--space-md);
      }

      .service-item {
        display: flex;
        align-items: flex-start;
        gap: var(--space-md);
      }

      .service-icon {
        width: 36px;
        height: 36px;
        border-radius: var(--radius-md);
        background: #ecfeff;
        color: var(--primary-600);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .service-info h5 {
        font-size: var(--font-sm);
        font-weight: 600;
        color: var(--gray-900);
        margin: 0 0 var(--space-xs) 0;
      }

      .service-info p {
        font-size: var(--font-sm);
        color: var(--gray-600);
        margin: 0;
        line-height: 1.4;
      }

      /* Toast */
      .toast {
        position: fixed;
        top: var(--space-xl);
        right: var(--space-xl);
        display: flex;
        align-items: center;
        gap: var(--space-md);
        padding: var(--space-lg);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-xl);
        max-width: 400px;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
      }

      .toast-success {
        background: var(--success-50);
        color: var(--success-800);
        border: 1px solid var(--success-200);
      }

      .toast-error {
        background: var(--error-50);
        color: var(--error-800);
        border: 1px solid var(--error-200);
      }

      .toast-icon {
        flex-shrink: 0;
        font-size: var(--font-lg);
      }

      .toast-content {
        flex: 1;
        min-width: 0;
      }

      .toast-content p {
        margin: 0;
        font-size: var(--font-sm);
        font-weight: 500;
      }

      .toast-close {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        padding: var(--space-xs);
        border-radius: var(--radius-sm);
        opacity: 0.7;
        transition: var(--transition-fast);
        flex-shrink: 0;
      }

      .toast-close:hover {
        opacity: 1;
        background: rgba(0, 0, 0, 0.1);
      }

      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      /* Responsive Design */
      @media (max-width: 768px) {
        .second-opinion-container {
          padding: var(--space-md);
        }
        
        .hero-content {
          grid-template-columns: 1fr;
          text-align: center;
          gap: var(--space-xl);
        }
        
        .hero-controls {
          min-width: auto;
          width: 100%;
        }
        
        .control-row {
          flex-direction: column;
        }
        
        .schedule-grid {
          grid-template-columns: 1fr;
        }
        
        .featured-doctors {
          grid-template-columns: 1fr;
        }
        
        .navigation-buttons {
          flex-direction: column;
          gap: var(--space-md);
        }
        
        .nav-btn {
          width: 100%;
          justify-content: center;
        }
        
        .toast {
          left: var(--space-md);
          right: var(--space-md);
          top: var(--space-md);
          max-width: none;
        }
      }

      @media (max-width: 480px) {
        .step-items {
          grid-template-columns: 1fr;
        }
        
        .doctor-card {
          flex-direction: column;
          text-align: center;
        }
        
        .doctor-fee {
          text-align: center;
        }
        
        .summary-item {
          flex-direction: column;
          text-align: center;
        }
        
        .item-label {
          min-width: auto;
        }
        
        .item-value {
          text-align: center;
        }
      }
    `}</style>
  );
});

// Memoized subcomponents to prevent re-renders during typing
const HeroSection = React.memo(function HeroSection({ 
  searchQuery, 
  onSearchChange, 
  onClearSearch, 
  sortBy, 
  onSortChange, 
  showFilters, 
  onToggleFilters 
}) {
  const searchInputRef = useRef(null);

  const clearSearch = useCallback(() => {
    onClearSearch();
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [onClearSearch]);

  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">Get Expert Second Opinion</h1>
          <p className="hero-description">
            Connect with specialist doctors, share your medical reports, and get professional 
            second opinions from the comfort of your home. Our network of qualified specialists 
            is ready to provide you with comprehensive medical consultations.
          </p>
        </div>

        <div className="hero-controls">
          <div className="search-container">
            <FiSearch className="search-icon" />
            <input
              ref={searchInputRef}
              type="text"
              className="search-input"
              value={searchQuery}
              onChange={onSearchChange}
              placeholder="Search doctors, specialty or location"
              aria-label="Search doctors"
              autoComplete="off"
              spellCheck="false"
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search"
                onClick={clearSearch}
                tabIndex={-1}
              >
                <FiX />
              </button>
            )}
          </div>

          <div className="control-row">
            <select
              value={sortBy}
              onChange={onSortChange}
              className="sort-select"
            >
              <option value="relevance">Sort by Relevance</option>
              <option value="name">Sort by Name</option>
              <option value="fee-asc">Fee: Low to High</option>
              <option value="fee-desc">Fee: High to Low</option>
            </select>

            <button
              type="button"
              className="filter-toggle"
              onClick={onToggleFilters}
            >
              {showFilters ? "Hide" : "Show"} Filters
              <FiChevronDown className={`chevron ${showFilters ? "rotated" : ""}`} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
});

const Stepper = React.memo(function Stepper({ steps, currentStep }) {
  const progress = (currentStep / (steps.length - 1)) * 100;

  return (
    <div className="stepper-container">
      <div className="progress-track">
        <div 
          className="progress-bar" 
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="step-items">
        {steps.map((step, index) => (
          <div 
            key={index} 
            className={`step-item ${
              index < currentStep ? 'completed' : 
              index === currentStep ? 'active' : 'pending'
            }`}
          >
            <div className="step-indicator">
              {index < currentStep ? <FiCheck /> : index + 1}
            </div>
            <div className="step-label">{step}</div>
          </div>
        ))}
      </div>
    </div>
  );
});

// FilterSidebar now receives dynamic specialties and locations
const FilterSidebar = React.memo(function FilterSidebar({ 
  collapsed, 
  filteredDoctors, 
  formData, 
  onSelectDoctor,
  selectedSpecialty,
  onSpecialtyChange,
  selectedLocation,
  onLocationChange,
  onClearFilters,
  specialties = [],
  locations = []
}) {
  const clearFilters = useCallback(() => {
    onClearFilters();
  }, [onClearFilters]);

  return (
    <aside className={`filter-sidebar ${collapsed ? 'collapsed' : 'expanded'}`}>
      <div className="filter-section">
        <div className="filter-header">
          <h3>Filters</h3>
          <button type="button" className="clear-filters" onClick={clearFilters}>
            Reset All
          </button>
        </div>

        <div className="filter-group">
          <label className="filter-label">Specialty</label>
          <select
            value={selectedSpecialty}
            onChange={onSpecialtyChange}
            className="filter-select"
          >
            <option value="">All Specialties</option>
            {specialties.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Location</label>
          <select
            value={selectedLocation}
            onChange={onLocationChange}
            className="filter-select"
          >
            <option value="">All Locations</option>
            {locations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="doctors-list">
        <div className="doctors-header">
          <h4>Available Doctors ({filteredDoctors.length})</h4>
        </div>
        
        <div className="doctors-scroll">
          {filteredDoctors.length === 0 ? (
            <div className="no-doctors">
              <FiSearch className="no-doctors-icon" />
              <p>No doctors match your search criteria</p>
              <button className="clear-search-btn" onClick={clearFilters}>
                Clear all filters
              </button>
            </div>
          ) : (
            filteredDoctors.map(doctor => (
              <DoctorCard
                key={doctor._id}
                doctor={doctor}
                isSelected={formData.doctorId === doctor._id}
                onSelect={() => onSelectDoctor(doctor._id)}
              />
            ))
          )}
        </div>
      </div>
    </aside>
  );
});

const StepPanel = React.memo(function StepPanel({ children }) {
  return (
    <div className="step-panel">
      <div className="step-content">{children}</div>
    </div>
  );
});

const SummarySidebar = React.memo(function SummarySidebar({ doctor, formData, files }) {
  const consultationFee = doctor?.feePerConsultation || 0;

  const services = [
    { icon: FiVideo, title: "Video Consultation", desc: "HD quality video calls" },
    { icon: FiFileText, title: "Digital Reports", desc: "Secure report sharing" },
    { icon: FiShield, title: "Privacy Protected", desc: "End-to-end encryption" },
    { icon: FiCalendar, title: "Flexible Scheduling", desc: "Book at your convenience" },
  ];

  return (
    <aside className="summary-sidebar">
      <div className="summary-card">
        <div className="summary-header">
          <h3>Appointment Summary</h3>
          <p>Review your selection</p>
        </div>

        <div className="summary-details">
          <div className="summary-item">
            <div className="item-label">
              <FiUser className="item-icon" />
              Doctor
            </div>
            <div className="item-value">
              {doctor ? `Dr. ${doctor.name}` : "Not selected"}
            </div>
          </div>

          <div className="summary-item">
            <div className="item-label">
              <FiCalendar className="item-icon" />
              Date & Time
            </div>
            <div className="item-value">
              {formData.date && formData.time 
                ? `${formData.date} at ${formData.time}`
                : "Not scheduled"
              }
            </div>
          </div>

          <div className="summary-item">
            <div className="item-label">
              <FiVideo className="item-icon" />
              Mode
            </div>
            <div className="item-value">
              {formData.mode === 'online' ? 'Video Consultation' : 'In-Person Visit'}
            </div>
          </div>
        </div>

        <div className="fee-section">
          <div className="fee-breakdown">
            <div className="fee-item">
              <span>Consultation Fee</span>
              <span>₹{consultationFee}</span>
            </div>
            <div className="fee-item subtotal">
              <span>Total</span>
              <span>₹{consultationFee}</span>
            </div>
          </div>
          <p className="fee-note">Platform and payment gateway charges may apply</p>
        </div>
      </div>

      <div className="services-card">
        <h4>What's Included</h4>
        <div className="services-list">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div key={index} className="service-item">
                <div className="service-icon">
                  <Icon />
                </div>
                <div className="service-info">
                  <h5>{service.title}</h5>
                  <p>{service.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
});

const Toast = React.memo(function Toast({ type, message, onClose, autoClose = true }) {
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-icon">
        {type === "success" ? <FiCheckCircle /> : <FiAlertTriangle />}
      </div>
      <div className="toast-content">
        <p>{message}</p>
      </div>
      <button className="toast-close" onClick={onClose}>
        <FiX />
      </button>
    </div>
  );
});

// Memoized DoctorCard component
const DoctorCard = React.memo(function DoctorCard({ doctor, isSelected, onSelect }) {
  const getInitials = (name) => {
    return (name || "DR")
      .split(" ")
      .map(n => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const fee = doctor.feePerConsultation || 500;
  const rating = doctor.rating || 4.8;

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      type="button"
      className={`doctor-card ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
    >
      <div className="doctor-avatar">
        {getInitials(doctor.name)}
      </div>

      <div className="doctor-info">
        <h4 className="doctor-name">Dr. {doctor.name}</h4>
        <p className="doctor-specialty">{doctor.specialization || "General Practice"}</p>
        
        <div className="doctor-meta">
          <span className="rating">
            <FiStar className="star-icon" />
            {rating}
          </span>
          <span className="location">
            <FiMapPin className="location-icon" />
            {doctor.location || "Remote"}
          </span>
        </div>

        <div className="doctor-availability">
          <span className={`availability-status ${doctor.available ? 'available' : 'busy'}`}>
            {doctor.available ? 'Available' : 'Busy'}
          </span>
        </div>
      </div>

      <div className="doctor-fee">
        <span className="fee-amount">₹{fee}</span>
      </div>

      {isSelected && (
        <div className="selection-indicator">
          <FiCheck />
        </div>
      )}
    </motion.button>
  );
});

export default function GetSecondOpinion() {
  // State management - keeping your existing structure
  const [formData, setFormData] = useState({
    doctorId: "",
    problem: "",
    treatment: "",
    date: "",
    time: "",
    mode: "online",
  });
  
  const [files, setFiles] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [step, setStep] = useState(0);
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [patientData, setPatientData] = useState(null);
  
  // Filter states - using separate state to prevent re-render issues
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [sortBy, setSortBy] = useState("relevance");
  
  // File handling
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef(null);

  const steps = ["Choose Doctor", "Medical Details", "Schedule", "Upload Reports"];
  const isLastStep = step === steps.length - 1;

  // Debounced search for smooth typing
  const debouncedSearch = useDebouncedValue(searchQuery, 250);

  // Dynamic dropdown options from fetched doctors data
  const specialties = useMemo(() => {
    return Array.from(
      new Set(
        (doctors || [])
          .map(d => (d.specialization || "").trim())
          .filter(Boolean)
      )
    ).sort((a, b) => a.localeCompare(b));
  }, [doctors]);

  const locations = useMemo(() => {
    const all = (doctors || []).flatMap(d => {
      const v = (d.location || "").trim();
      return v ? [v] : [];
    });
    return Array.from(new Set(all)).sort((a, b) => a.localeCompare(b));
  }, [doctors]);

  // Memoized filtered doctors to prevent unnecessary re-calculations
  const filteredDoctors = useMemo(() => {
    if (!doctors || doctors.length === 0) return [];

    let result = [...doctors];
    
    // Apply search filter (debounced)
    if (debouncedSearch.trim()) {
      const query = debouncedSearch.toLowerCase().trim();
      result = result.filter(doctor =>
        (doctor.name || "").toLowerCase().includes(query) ||
        (doctor.specialization || "").toLowerCase().includes(query) ||
        (doctor.location || "").toLowerCase().includes(query)
      );
    }
    
    // Apply specialty filter
    if (selectedSpecialty) {
      result = result.filter(doctor => doctor.specialization === selectedSpecialty);
    }
    
    // Apply location filter
    if (selectedLocation) {
      result = result.filter(doctor => 
        doctor.location && 
        doctor.location.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "fee-asc":
        result.sort((a, b) => (a.feePerConsultation || 0) - (b.feePerConsultation || 0));
        break;
      case "fee-desc":
        result.sort((a, b) => (b.feePerConsultation || 0) - (a.feePerConsultation || 0));
        break;
      case "name":
        result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        break;
      default:
        // relevance - no sorting needed
        break;
    }

    return result;
  }, [doctors, debouncedSearch, selectedSpecialty, selectedLocation, sortBy]);

  // Data fetching functions - keeping your existing API calls
  const fetchPatientData = async () => {
    try {
      const res = await axios.get("http://localhost:1600/api/patient/me", { 
        withCredentials: true 
      });
      setPatientData(res.data?.data || null);
    } catch {
      setPatientData(null);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await axios.get("http://localhost:1600/api/doctor");
      const list = res.data?.data || [];
      setDoctors(list);
    } catch {
      setMessage({ 
        type: "error", 
        text: "Could not load doctors. Please refresh the page." 
      });
      setTimeout(() => setMessage(null), 4000);
    }
  };

  // Effects - keeping your existing logic
  useEffect(() => {
    fetchPatientData();
    fetchDoctors();
  }, []);

  useEffect(() => {
    updatePreviews();
    return () => cleanupPreviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  const updatePreviews = () => {
    cleanupPreviews();
    const newPreviews = files.map(file => ({
      url: file.type.includes("image") ? URL.createObjectURL(file) : null,
      name: file.name,
      size: file.size,
      type: file.type,
    }));
    setPreviews(newPreviews);
  };

  const cleanupPreviews = () => {
    previews.forEach(preview => {
      if (preview.url) URL.revokeObjectURL(preview.url);
    });
  };

  // Handler functions - memoized to prevent re-renders and maintain input focus
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSearchInputChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  const handleSortChange = useCallback((e) => {
    setSortBy(e.target.value);
  }, []);

  const handleToggleFilters = useCallback(() => {
    setShowFilters(prev => !prev);
  }, []);

  const handleSpecialtyChange = useCallback((e) => {
    setSelectedSpecialty(e.target.value);
  }, []);

  const handleLocationChange = useCallback((e) => {
    setSelectedLocation(e.target.value);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedSpecialty("");
    setSelectedLocation("");
  }, []);

  const handleFileChange = useCallback((e) => {
    const selectedFiles = Array.from(e.target.files || []);
    processFiles(selectedFiles);
  }, []);

  const handleFileDrop = useCallback((e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files || []);
    processFiles(droppedFiles);
  }, []);

  const processFiles = (fileList) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const acceptedFiles = fileList.filter(file => file.size <= maxSize);
    const rejectedFiles = fileList.filter(file => file.size > maxSize);
    
    if (rejectedFiles.length > 0) {
      setMessage({
        type: "error",
        text: `${rejectedFiles.length} file(s) exceed 10MB limit and were skipped.`
      });
      setTimeout(() => setMessage(null), 3500);
    }
    
    if (acceptedFiles.length > 0) {
      setFiles(prev => [...prev, ...acceptedFiles]);
    }
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation - keeping your existing validation logic
    const requiredFields = ['doctorId', 'problem', 'treatment', 'date', 'time'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      setMessage({ 
        type: "error", 
        text: "Please fill all required fields." 
      });
      return;
    }
    
    if (files.length === 0) {
      setMessage({ 
        type: "error", 
        text: "Please upload at least one medical report." 
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      payload.append(key, value);
    });
    files.forEach(file => payload.append("files", file));

    try {
      const response = await axios.post(
        "http://localhost:1600/api/patient/get-second-opinion", 
        payload,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setMessage({ 
        type: "success", 
        text: response.data?.message || "Request submitted successfully!" 
      });

      const selectedDoctor = doctors.find(d => d._id === formData.doctorId);
      setAppointmentDetails({
        _id: response.data.data?._id || "",
        email: patientData?.email || "",
        doctorName: selectedDoctor?.name || "",
        date: formData.date,
        price: selectedDoctor?.feePerConsultation || 500,
      });

      // Reset form
      if (fileInputRef.current) fileInputRef.current.value = null;
      setStep(0);
    } catch (error) {
      setMessage({ 
        type: "error", 
        text: error.response?.data?.message || "Submission failed. Please try logging in first." 
      });
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(prev => Math.min(steps.length - 1, prev + 1));
  const prevStep = () => setStep(prev => Math.max(0, prev - 1));

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <StepPanel>
            <div className="step-header">
              <h2>Choose Your Specialist</h2>
              <p>Browse through our network of qualified specialists and select the doctor best suited for your case.</p>
            </div>
            
            <div className="featured-doctors">
              {doctors.slice(0, 3).map(doctor => (
                <div key={doctor._id} className="featured-doctor-card">
                  <div className="fd-avatar">
                    {(doctor.name || "DR").split(" ").map(n => n[0]).slice(0,2).join("")}
                  </div>
                  <div className="fd-info">
                    <h4>Dr. {doctor.name}</h4>
                    <p>{doctor.specialization || "General Practice"}</p>
                    <span className="fd-fee">₹{doctor.feePerConsultation || 500}</span>
                  </div>
                </div>
              ))}
            </div>
          </StepPanel>
        );

      case 1:
        return (
          <StepPanel>
            <div className="step-header">
              <h2>Medical Details</h2>
              <p>Provide detailed information about your medical condition and previous treatments.</p>
            </div>

            <div className="form-group">
              <label className="form-label">
                Describe Your Medical Concern *
              </label>
              <textarea
                name="problem"
                value={formData.problem}
                onChange={handleInputChange}
                placeholder="Please describe your symptoms, duration, severity, and any other relevant details..."
                className="form-textarea"
                rows={4}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Previous Treatments & Medications *
              </label>
              <textarea
                name="treatment"
                value={formData.treatment}
                onChange={handleInputChange}
                placeholder="List any medications, surgeries, investigations, or treatments you've had..."
                className="form-textarea"
                rows={4}
                required
              />
            </div>
          </StepPanel>
        );

      case 2:
        return (
          <StepPanel>
            <div className="step-header">
              <h2>Schedule Appointment</h2>
              <p>Choose your preferred date, time, and consultation mode.</p>
            </div>

            <div className="schedule-grid">
              <div className="form-group">
                <label className="form-label">
                  <FiVideo className="label-icon" />
                  Consultation Mode *
                </label>
                <select
                  name="mode"
                  value={formData.mode}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="online">Video Consultation</option>
                  <option value="offline">In-Person Visit</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FiCalendar className="label-icon" />
                  Preferred Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="form-input"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FiClock className="label-icon" />
                  Preferred Time *
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
            </div>
          </StepPanel>
        );

      case 3:
        return (
          <StepPanel>
            <div className="step-header">
              <h2>Upload Medical Reports</h2>
              <p>Upload your medical reports, test results, and relevant documents for review.</p>
            </div>

            <div
              className="file-upload-area"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <FiUpload className="upload-icon" />
              <div className="upload-text">
                <h3>Drop files here or click to browse</h3>
                <p>Supports JPG, PNG, PDF • Maximum 10MB per file</p>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />

            {previews.length > 0 && (
              <div className="uploaded-files">
                <h4>Uploaded Files ({files.length})</h4>
                <div className="file-list">
                  {previews.map((preview, index) => (
                    <div key={index} className="file-item">
                      <div className="file-preview">
                        {preview.url ? (
                          <img src={preview.url} alt={preview.name} />
                        ) : (
                          <div className="file-placeholder">
                            <span>PDF</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="file-details">
                        <h5>{preview.name}</h5>
                        <p>{(preview.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      
                      <button
                        type="button"
                        className="remove-file"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(index);
                        }}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </StepPanel>
        );

      default:
        return null;
    }
  };

  if (appointmentDetails) {
    return <Payment appointment={appointmentDetails} />;
  }

  return (
    <>
      <StyleBlock />
      
      <div className="second-opinion-container">
        <form className="so-form" onSubmit={handleSubmit}>
          <HeroSection 
            searchQuery={searchQuery}
            onSearchChange={handleSearchInputChange}
            onClearSearch={handleClearSearch}
            sortBy={sortBy}
            onSortChange={handleSortChange}
            showFilters={showFilters}
            onToggleFilters={handleToggleFilters}
          />

          <Stepper steps={steps} currentStep={step} />

          <div className="so-layout">
            <FilterSidebar 
              collapsed={!showFilters}
              filteredDoctors={filteredDoctors}
              formData={formData}
              onSelectDoctor={(doctorId) => setFormData(prev => ({ ...prev, doctorId }))}
              selectedSpecialty={selectedSpecialty}
              onSpecialtyChange={handleSpecialtyChange}
              selectedLocation={selectedLocation}
              onLocationChange={handleLocationChange}
              onClearFilters={handleClearFilters}
              specialties={specialties}
              locations={locations}
            />

            <main className="so-main">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderStepContent()}
                </motion.div>
              </AnimatePresence>

              <div className="navigation-buttons">
                <button
                  type="button"
                  className={`nav-btn prev-btn ${step === 0 || loading ? 'disabled' : ''}`}
                  onClick={prevStep}
                  disabled={step === 0 || loading}
                >
                  <FiArrowLeft /> Back
                </button>

                {!isLastStep ? (
                  <button
                    type="button"
                    className="nav-btn next-btn"
                    onClick={nextStep}
                  >
                    Next <FiArrowRight />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="nav-btn submit-btn"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <FiLoader className="spinner" /> Processing...
                      </>
                    ) : (
                      <>
                        Book Consultation <FiArrowRight />
                      </>
                    )}
                  </button>
                )}
              </div>
            </main>

            <SummarySidebar 
              doctor={doctors.find(d => d._id === formData.doctorId)} 
              formData={formData} 
              files={files}
            />
          </div>

          {message && (
            <Toast
              type={message.type}
              message={message.text}
              onClose={() => setMessage(null)}
            />
          )}
        </form>
      </div>
    </>
  );
}
