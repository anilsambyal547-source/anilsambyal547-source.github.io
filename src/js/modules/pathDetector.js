/**
 * Path detector module for project pages and base path routing.
 * Handles detection and parsing of URLs across root and subfolder hosting (e.g. GitHub Pages /portfolio).
 */

/**
 * Returns the base path prefix (e.g. '/portfolio' on GitHub Pages project sites, or '' at root).
 * @returns {string}
 */
function getBasePath() {
    if (typeof window !== 'undefined' && typeof window.__BASE_PATH__ === 'string') {
        return window.__BASE_PATH__;
    }
    const p = (typeof window !== 'undefined' && window.location.pathname) || '';
    if (p === '/portfolio' || p.startsWith('/portfolio/')) {
        return '/portfolio';
    }
    return '';
}

/**
 * Normalizes window.location.pathname by stripping the base path prefix and index.html
 * @returns {string} E.g. '/', '/project', '/about', '/writeups', '/404'
 */
function getNormalizedPath() {
    const base = getBasePath();
    let p = (typeof window !== 'undefined' && window.location.pathname) || '/';
    if (base && p.startsWith(base)) {
        p = p.substring(base.length);
    }
    p = p.replace(/\/index\.html$/i, '');
    if (!p || p === '' || p === '/') {
        return '/';
    }
    if (!p.startsWith('/')) {
        p = '/' + p;
    }
    return p;
}

/**
 * Checks if current page is the Home page
 * @returns {boolean}
 */
function isHomePage() {
    const p = getNormalizedPath();
    return p === '/';
}

/**
 * Checks if the current URL matches the project page pattern
 * @returns {boolean} True if current page is a project page
 */
function isProjectPage() {
    const p = getNormalizedPath();
    return p === '/project' || p === '/project/';
}

/**
 * Checks if current page is an other internal page (about, writeups, publications, etc.)
 * Notice: The Home page ('/') is NEVER an otherPage!
 * @returns {boolean}
 */
function isOtherPage() {
    const p = getNormalizedPath();
    if (p === '/' || p === '/project' || p === '/project/') {
        return false;
    }
    return true;
}

/**
 * Extracts the project name from the URL query string or path
 * @returns {string|null} The project name if found, null otherwise
 */
function getProjectName() {
    if (isHomePage()) {
        return null;
    }

    if (isProjectPage()) {
        const urlParams = new URLSearchParams(window.location.search);
        const keys = Array.from(urlParams.keys());
        return keys.length > 0 ? keys[0] : null;
    }

    if (isOtherPage()) {
        let p = getNormalizedPath();
        p = p.replace(/^\/+/, '').replace(/\/+$/, '').replace(/\.html$/i, '');
        return p || null;
    }

    return null;
}

/**
 * Gets the full query string after the ? in project URLs
 * @returns {string|null} The query string part after ?, null if not a project page or no query
 */
function getProjectQuery() {
    if (!isProjectPage()) {
        return null;
    }

    const search = window.location.search;
    return search.startsWith('?') ? search.substring(1) : null;
}

export {
    getBasePath,
    getNormalizedPath,
    isHomePage,
    isProjectPage,
    getProjectName,
    getProjectQuery,
    isOtherPage
};
