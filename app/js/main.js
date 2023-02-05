/* Top Menu */
const topMenu = document.querySelector('.menu-top');
document.querySelector('.menu-top__btn').onclick = () => {
	topMenu.classList.remove('menu-top--hidden')
}
document.querySelector('.menu-top__close').onclick = () => {
	topMenu.classList.add('menu-top--hidden')
}

/* Support Window */
const supportWindow = document.querySelector('.support');
document.querySelector('.diamond').onclick = () => {
	supportWindow.classList.add('support--active');
}
document.querySelector('.support__close').onclick = () => {
	supportWindow.classList.remove('support--active');
}

/* Video Modal */
const videoModal = document.querySelector('.modal-video');
document.querySelector('.hero__watch').addEventListener('click', () => {
	videoModal.classList.add('modal-video--show');
	document.querySelector('body').style.overflow = 'hidden';
});
document.querySelector('.modal-video__close').addEventListener('click', () => {
	videoModal.classList.remove('modal-video--show');
	document.querySelector('body').style.overflow = 'auto';
});

/* Clock + Date */
setDateTime();

/* Toggle style for add to list btn */
document.querySelectorAll('.browse__add').forEach(item => {
	item.addEventListener('click', () => {
		if (item.classList.contains('browse__add--active')) {
			item.textContent = 'Add To Watch List';
		} else {
			item.textContent = 'Added To Watch List';
		}
		item.classList.toggle('browse__add--active');
	});
});

/* Toggle tabs */
const tabs = document.querySelectorAll('[data-tab-name]');
const movies = document.querySelectorAll('[data-tab-group]');

const activeTab = document.querySelector('.browse__link.menu__link--active');
toggleTab(activeTab, movies);

tabs.forEach(tab => {
	tab.addEventListener('click', function () {
		switchClass(tab, tabs, 'menu__link--active');
		toggleTab(this, movies);
	});
});

/* Slider */
const box = document.querySelector('.recommended__movies');
const items = document.querySelectorAll('.recommended__movie');
const prevBtn = document.querySelector('.recommended__btn--prev');
const nextBtn = document.querySelector('.recommended__btn--next');
let sizingsInfo;
resize();
window.addEventListener('resize', resize);
prevBtn.onclick = () => {
	makeSlide('prev');
}
nextBtn.onclick = () => {
	makeSlide('next');
}

/* Swipe */
let touchStart = null;
let touchEnd = null;

box.addEventListener("touchstart", function (e) { TouchStart(e); });
box.addEventListener("touchmove", function (e) { TouchMove(e); });
box.addEventListener("touchend", function (e) { TouchEnd(e); });


/* ------------------ Functions ------------------ */
function setDateTime() {
	const now = new Date();
	const date = now.toLocaleString('en', {
		month: 'short',
		day: 'numeric'
	});
	const weekday = now.toLocaleString('en', {
		weekday: 'long'
	});
	const time = now.toLocaleString('en', {
		hour12: true,
		hour: '2-digit',
		minute: '2-digit'
	});
	document.querySelector('.header__time').textContent = time;
	document.querySelector('.header__date-day').textContent = date;
	document.querySelector('.header__date-week').textContent = weekday;
	setTimeout(setDateTime, 1000);
}

function switchClass(item, items, className) {
	items.forEach(x => x.classList.remove(className));
	item.classList.add(className);
}

function toggleTab(tab, tabItems) {
	const tabGroup = tab.getAttribute('data-tab-name');
	tabItems.forEach(item => {
		if (item.getAttribute('data-tab-group') != tabGroup) {
			hide(item);
		} else {
			show(item);
		}
	});
}

function hide(item) {
	item.style.opacity = 0;
	setTimeout(() => {
		item.style.display = 'none';
	}, 200);
}

function show(item) {
	item.style.display = '';
	setTimeout(() => {
		item.style.opacity = 1;
	}, 10);
}

function makeSlide(op) {
	const offset = items[1].offsetLeft - items[0].offsetLeft;
	items.forEach(item => {
		const curValue = +(item.style.transform)
			.split('(')[1]
			.slice(0, -1)
			.replace('px', '');
		if (op == "prev") {
			item.style.transform = `translateX(${curValue + offset}px)`;
		} else if (op == "next") {
			item.style.transform = `translateX(${curValue - offset}px)`;
		} else {
			console.error('Unknown operation to make slide');
		}
	});
	blockNavBtn(sizingsInfo.maxItems, sizingsInfo.gap);
}

function getSizingsInfo(width) {
	if (width >= 900) {
		return { maxItems: 4, gap: 20, padding: 0 };
	} else if (width >= 700 && width < 900) {
		return { maxItems: 3, gap: 40, padding: 40 };
	} else if (width >= 500 && width < 700) {
		return { maxItems: 2, gap: 50, padding: 50 };
	} else {
		return { maxItems: 1, gap: 60, padding: 60 };
	}
}

function resize() {
	items.forEach(item => {
		item.style.transform = 'translateX(0px)';
	});
	const boxWidth = document.querySelector('.recommended__movies').offsetWidth;
	sizingsInfo = getSizingsInfo(boxWidth);

	box.style.gap = `${sizingsInfo.gap}px`;
	box.style.paddingLeft = `${sizingsInfo.padding}px`;
	box.style.paddingRight = `${sizingsInfo.padding}px`;

	const itemWidth = (boxWidth - sizingsInfo.padding * 2 - (sizingsInfo.gap * (sizingsInfo.maxItems - 1))) / sizingsInfo.maxItems;
	items.forEach(item => {
		item.style.minWidth = `${itemWidth}px`;
	})

	blockNavBtn(sizingsInfo.maxItems, sizingsInfo.gap);
}

function blockNavBtn(maxItems, gap) {
	if (items[0].style.transform == 'translateX(0px)') {
		document.querySelector('.recommended__btn--prev').style.visibility = 'hidden';
	} else {
		document.querySelector('.recommended__btn--prev').style.visibility = 'visible';
	}

	if (items[items.length - 1].style.transform == `translateX(-${items[0].offsetWidth * (items.length - maxItems) + gap * (items.length - maxItems)}px)`) {
		document.querySelector('.recommended__btn--next').style.visibility = 'hidden';
	} else {
		document.querySelector('.recommended__btn--next').style.visibility = 'visible';
	}
}

function TouchStart(e) {
	touchStart = e.changedTouches[0].clientX;
	touchEnd = touchStart;
}

function TouchMove(e) {
	touchEnd = e.changedTouches[0].clientX;
}

function TouchEnd(e, color) {
	CheckAction();
	touchStart = null;
	touchEnd = null;
}

function CheckAction() {
	var d = touchStart - touchEnd;
	let cond = items[items.length - 1].style.transform == `translateX(-${items[0].offsetWidth * (items.length - sizingsInfo.maxItems) + sizingsInfo.gap * (items.length - sizingsInfo.maxItems)}px)`

	if (d > 30 && !cond) {
		makeSlide('next');
	} else if (d < -30 && items[0].style.transform != 'translateX(0px)') {
		makeSlide('prev');
	}
}