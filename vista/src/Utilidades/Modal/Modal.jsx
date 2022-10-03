import React from "react";
import PropTypes from "prop-types";
import "./Modal.css";

/**
 * 
 * @param {HTMLCollection} children - The content of the modal
 * @param {Boolean} visible - A flag for displaying or hidding the modal
 * @param {Function} toggle - Function for hidding the modal, triggered when the close button is clicked.
 * @param {Boolean} showHeader - A flag for displaying or hidding the header of the modal. True by default.
 * @param {String} title - The title of the modal. Displays 'Alert!' by default.
 * @returns -The modal component
 */

const Modal = ({ children, visible, toggle, showHeader=true, title="Alert!" }) => {
  return (
    <>
      {visible &&
        <div className="overlay-div">
          <div className="modalContainer-div">
            {showHeader &&
              <div className="modalHeader-div">
                <h2>{title}</h2>
              </div>
            }

            <button className="modalClose-btn" onClick={() => toggle(false)}>
              {/* Close icon source-code */}
              <svg xmlns="http://www.w3.org/2000/svg" width="16"
                height="16" fill="currentColor"
                className="bi bi-x-lg" viewBox="0 0 16 16">
                <path
                  fillRule="evenodd"
                  d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"
                />
                <path
                  fillRule="evenodd"
                  d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z"
                />
              </svg>
            </button>

            <div className="modalContent-div">
              { children }
            </div>
          </div>
        </div>
      }
    </>
  );
};

Modal.propTypes = {
  children: PropTypes.node,
  visible: PropTypes.bool,
  toggle: PropTypes.func,
  showHeader: PropTypes.bool,
  title: PropTypes.string
}

export default Modal;
