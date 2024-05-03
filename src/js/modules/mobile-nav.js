function mobileNav() {
	const nav = document.querySelector('.mobile-nav')
	const navBtn = document.querySelector('.mobile-nav-btn')
	const menuIcon = document.querySelector('.nav-icon')
	navBtn.addEventListener('click', () => {
		nav.classList.toggle('mobile-nav--open')
		menuIcon.classList.toggle('nav-icon--active')
		document.body.classList.toggle('no-scroll')
	})
	}
	

export default mobileNav