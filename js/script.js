document.addEventListener('DOMContentLoaded', function () {
  const isSafari = () => {
    return (
      ~navigator.userAgent.indexOf('Safari') &&
      navigator.userAgent.indexOf('Chrome') < 0
    );
  };

  const isMobile = {
    Android: function () {
      return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
      return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
      return navigator.userAgent.match(/Opera mini/i);
    },
    Windows: function () {
      return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
      return (
        isMobile.Android() ||
        isMobile.BlackBerry() ||
        isMobile.iOS() ||
        isMobile.Opera() ||
        isMobile.Windows()
      );
    },
  };

  if (isMobile.any()) {
    document.querySelector('body').classList.add('v-mobile');
    document.querySelector('html').classList.add('v-mobile');
  } else {
    document.querySelector('body').classList.add('v-desk');
    document.querySelector('html').classList.add('v-desk');
  }

  //normal vh and vw
  let vh = window.innerHeight * 0.01;
  let vw = window.innerWidth;

  document.body.style.setProperty('--vh', `${vh}px`);

  window.addEventListener('resize', () => {
    if (vh === window.innerHeight * 0.01 || document.body.clientWidth < 900) {
      return;
    }

    vh = window.innerHeight * 0.01;
    document.body.style.setProperty('--vh', `${vh}px`);
  });

  //change header when scroll
  const header = document.querySelector('.header');
  let isScrollHeader = true;

  header &&
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50 && isScrollHeader) {
        //console.log(1);
        header.classList.add('_scrolled');
        isScrollHeader = false;
        return;
      }

      if (window.scrollY <= 50 && !isScrollHeader) {
        header.classList.remove('_scrolled');
        isScrollHeader = true;
        return;
      }
    });

  //popup
  const makeTimelinePopup = (item) => {
    const popupInner = item.querySelector('.popup__scroll');
    if (!popupInner) {
      return;
    }

    const timelinePopup = gsap.timeline({
      defaults: { duration: 0.3, ease: 'power4.inOut' },
    });
    timelinePopup
      //.set(popupInner, { x: '150%' })
      .set(item, { display: 'none' })
      .from(item, { display: 'none' })
      .from(item, { opacity: 0 })
      .from(popupInner, { x: '150%' })
      .to(item, { display: 'flex' })
      .to(item, { opacity: 1 })
      .to(popupInner, { x: 0 }, '-=75%');

    return timelinePopup;
  };

  const popupAnimations = {};
  const popups = document.querySelectorAll('.popup');

  if (popups.length !== 0) {
    popups.forEach((popup) => {
      const timeline = makeTimelinePopup(popup);
      timeline.pause();
      popupAnimations[popup.dataset.popupname] = timeline;
    });
  }

  //open popup
  const popupOpenBtns = document.querySelectorAll('.popup-open');

  const openPopup = (evt) => {
    const popupClass = evt.target.dataset.popup;
    const popup = document.querySelector(`[data-popupname=${popupClass}]`);

    popupAnimations[popupClass].play();

    popup.classList.add('_opened');
    document.querySelector('html').classList.add('_lock');
    document.querySelector('body').classList.add('_lock');
  };

  if (popupOpenBtns) {
    popupOpenBtns.forEach((item) => {
      item.addEventListener('click', (evt) => {
        evt.preventDefault();
        // console.log(popupAnimations);
        openPopup(evt);
      });
    });
  }

  //close popup
  const popupCloseBtns = document.querySelectorAll('.popup__close');
  const popupArr = document.querySelectorAll('.popup');

  const closePopup = (popup) => {
    popup.classList.remove('_opened');
    const popupClass = popup.dataset.popupname;
    //console.dir(popup);
    popupAnimations[popupClass].reverse();

    document.querySelector('html').classList.remove('_lock');
    document.querySelector('body').classList.remove('_lock');
  };

  if (popupCloseBtns) {
    popupCloseBtns.forEach((item) => {
      item.addEventListener('click', function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        const popup = this.parentElement.parentElement.parentElement;
        closePopup(popup);
      });
    });
  }

  if (popupArr) {
    popupArr.forEach((item) => {
      item.addEventListener('click', function (evt) {
        if (evt.target === this) {
          closePopup(this);
        }
      });
    });

    window.addEventListener('keydown', function (evt) {
      if (evt.keyCode === 27) {
        const popup = document.querySelector('.popup._opened');
        if (popup) {
          closePopup(popup);
        }
      }
    });
  }

  //anchor menu

  //stake anchor handler
  const stakeAnchorHandler = (section, type) => {
    const buttons = section.querySelectorAll('.separate-bullet');
    if (buttons.length === 0) {
      return;
    }
    //anchor.addEventListener('click', () => {
    console.log(buttons[type]);
    buttons[type].click();
    //});
  };

  const anchors = document.querySelectorAll('._anchor');
  if (anchors.length !== 0) {
    anchors.forEach((anchor) => {
      //console.log(anchor);
      anchor.addEventListener('click', (evt) => {
        evt.preventDefault();
        const sectionClass = evt.target.dataset.anchor;
        const section = document.querySelector(sectionClass);
        const header = document.querySelector('.header');

        if (!section || !header) {
          return null;
        }

        if (sectionClass === '.stake') {
          stakeAnchorHandler(
            section,
            evt.target.dataset.stake === 'mainnet' ? 0 : 1
          );
        }

        const paddingTop = parseInt(
          (section.currentStyle || window.getComputedStyle(section)).paddingTop
        );

        popupArr.forEach((item) => {
          closePopup(item);
        });

        window.scrollTo({
          top: section.offsetTop + paddingTop / 2 - header.clientHeight,
          behavior: 'smooth',
        });
      });
    });
  }

  //table add empty sales
  const tables = document.querySelectorAll('[data-table]');
  let lastColumnCount = getComputedStyle(document.body).getPropertyValue(
    '--table-count'
  );

  const removeEmptyCells = (table) => {
    const emptyCells = table.querySelectorAll('.stake-table__item._empty');

    if (emptyCells.length === 0) {
      return;
    }

    emptyCells.forEach((empty) => {
      empty.remove();
    });
  };

  const addEmptyCell = (childrenCount, columnCount, table) => {
    if (childrenCount % columnCount === 0) {
      return;
    }
    const counter = childrenCount + 1;

    const child = document.createElement('LI');
    child.setAttribute('class', 'stake-table__item _empty');
    table.appendChild(child);

    addEmptyCell(counter, columnCount, table);
  };

  const fixTable = (tables) => {
    if (tables.length === 0) {
      return;
    }

    tables.forEach((table) => {
      const columnCount = getComputedStyle(document.body).getPropertyValue(
        '--table-count'
      );
      let childrenCount = table.childElementCount;
      //console.log(columnCount);
      addEmptyCell(childrenCount, columnCount, table);
    });
  };

  tables.length !== 0 &&
    tables.forEach((table) => {
      removeEmptyCells(table);
    });

  if (document.body.clientWidth >= 900) {
    fixTable(tables);
  }

  window.addEventListener('resize', () => {
    if (vh !== window.innerHeight * 0.01) {
      return;
    }

    const columnCount = getComputedStyle(document.body).getPropertyValue(
      '--table-count'
    );

    if (lastColumnCount === columnCount || tables.length === 0) {
      return;
    }

    tables.forEach((table) => {
      removeEmptyCells(table);
    });

    lastColumnCount = columnCount;
    if (document.body.clientWidth >= 900) {
      fixTable(tables);
    }
  });

  //lerp
  function lerp(current, target, ease, approximationLeft = 0.001) {
    const val = current * (1 - ease) + target * ease;
    const diff = Math.abs(target - val);
    if (diff <= approximationLeft) {
      return target;
    }
    return val;
  }

  function stopAnimation(idAnimation) {
    cancelAnimationFrame(idAnimation);
  }

  //parallax in banner
  const parallaxSection = document.querySelector('.banner');
  const progressParallax = {
    currentX: 0,
    targetX: 0,
    currentY: 0,
    targetY: 0,
  };
  let parallaxImg;
  let idAnimationParallax = null;

  const parallaxImgMove = (targetX, targetY) => {
    if (!parallaxImg || !parallaxSection) {
      return;
    }

    if (isMobile.any()) {
      parallaxImg.style.transform = '';
      return;
    }

    progressParallax.targetX = targetX;
    progressParallax.targetY = targetY;

    progressParallax.currentX = lerp(
      progressParallax.currentX,
      progressParallax.targetX,
      0.15,
      0.01
    );

    progressParallax.currentY = lerp(
      progressParallax.currentY,
      progressParallax.targetY,
      0.15,
      0.01
    );

    parallaxImg.style.transform = `translate3d(${
      -progressParallax.currentX * 5
    }%, ${-progressParallax.currentY * 5}%, 0)`;

    if (
      progressParallax.currentX === progressParallax.targetX ||
      progressParallax.currentY === progressParallax.targetY
    ) {
      stopAnimation(idAnimationParallax);
    } else {
      parallaxImgMove(progressParallax.targetX, progressParallax.targetY);
    }
  };

  if (parallaxSection) {
    parallaxImg = parallaxSection.querySelector('.banner-img__additional img');

    parallaxSection.addEventListener('mousemove', (evt) => {
      if (!parallaxImg || isMobile.any()) {
        return;
      }

      const rect = parallaxSection.getBoundingClientRect();
      const startY = rect.top;
      const startX = rect.left;

      const y =
        Math.min(Math.max(evt.clientY - startY, 0), rect.height) /
        (rect.height * 2);
      const x =
        Math.min(Math.max(evt.clientX - startX, 0), rect.width) /
        (rect.width * 2);

      idAnimationParallax = window.requestAnimationFrame(() => {
        parallaxImgMove(x, y);
      });
    });
  }

  //light to rover when document ready
  const rovers = document.querySelectorAll('.banner-img__rover');
  rovers.length !== 0 &&
    rovers.forEach((item) => {
      const light = item.querySelector('#light');
      if (!light) {
        //console.log('hui');
        return;
      }
      //console.log(light.children);
      Array.from(light.children).forEach((svg) => {
        gsap
          .timeline()
          .from(svg, { opacity: 0 })
          .to(svg, { opacity: 1, duration: 0, ease: 'none' })
          .to(svg, { opacity: 0, duration: 0.1, delay: 1, ease: 'none' })
          .to(svg, { opacity: 1, duration: 0.3, ease: 'none' })
          .to(svg, { opacity: 0, duration: 0.1, ease: 'none' })
          .to(svg, { opacity: 1, duration: 4, delay: 2, ease: 'none' });
      });
    });

  //light to tower when document ready

  //record timeline
  const timelines = {};
  const recordTimeline = (item, timeline) => {
    timelines[item] = timeline;
  };

  //add event to play animation when section visible
  const isVisibleHandler = (element, timelineName) => {
    window.addEventListener('scroll', () => {
      const elementRect = element.getBoundingClientRect();
      const elementHeight = elementRect.height;

      let isAnimationPlay = false;

      const y = Math.min(
        Math.max(
          (-elementRect.top + window.innerHeight / 2) / (elementHeight * 1.2),
          0
        ),
        1
      );

      if (y > 0 && y < 1 && !isAnimationPlay) {
        timelines[timelineName].play();
        isAnimationPlay = true;
        return;
      }

      timelines[timelineName].pause();
      isAnimationPlay = false;
    });
  };

  //create timelines
  const towers = document.querySelectorAll('.banner-img__tower');
  towers.length !== 0 &&
    towers.forEach((tower, towerIndex) => {
      const lights = tower.querySelectorAll('.light');
      if (lights.length === 0) {
        //console.log('hui');
        return;
      }
      //console.log(light.children);
      lights.forEach((light, index) => {
        const timeline = gsap
          .timeline({ repeat: -1, yoyo: true })
          .from(light, { opacity: 0.3 })
          .to(light, { opacity: 1, duration: 4, delay: 1 });
        //.pause();

        recordTimeline(
          `${tower.classList[0]}-${towerIndex}-${light.classList[0]}-${index}`,
          timeline
        );

        isVisibleHandler(
          tower,
          `${tower.classList[0]}-${towerIndex}-${light.classList[0]}-${index}`
        );
      });
    });

  const smokes = document.querySelectorAll('.about-bg__main');
  smokes.length !== 0 &&
    !isMobile.any() &&
    smokes.forEach((smoke, smokeIndex) => {
      const lights = smoke.querySelectorAll('.about-bg__smoke');
      if (lights.length === 0) {
        //console.log('hui');
        return;
      }
      //console.log(light.children);
      lights.forEach((light, index) => {
        const timeline = gsap
          .timeline({ repeat: -1, yoyo: true })
          .from(light, { opacity: 0.3 })
          .to(light, { opacity: 1, duration: 4, delay: 1 });
        //.pause();

        recordTimeline(
          `${smoke.classList[0]}-${smokeIndex}-${light.classList[0]}-${index}`,
          timeline
        );

        isVisibleHandler(
          smoke,
          `${smoke.classList[0]}-${smokeIndex}-${light.classList[0]}-${index}`
        );
      });
    });

  //console.log(timelines);

  //footer light background
  const onVisibleFooter = (element, child) => {
    window.addEventListener('scroll', () => {
      const elementRect = element.getBoundingClientRect();
      const elementHeight = elementRect.height;

      let isVisible = false;

      const y = Math.min(
        Math.max(
          (-elementRect.top + window.innerHeight / 2) / (elementHeight * 1.2),
          0
        ),
        1
      );

      if (y > 0 && y < 1 && !isVisible) {
        isVisible = true;
        child.classList.add('_play');
        //console.log(child);
        return;
      }
      //console.log('invisible');
      isVisible = false;
    });
  };

  const footer = document.body.querySelector('.footer');
  if (footer && !isMobile.any()) {
    const childSvg = footer.querySelector('.footer-bg__main svg .light');
    childSvg && onVisibleFooter(footer, childSvg);
  }

  //swipers
  const separateSections = document.querySelectorAll('.separate');

  const separateSlidersArray = [];

  if (separateSections.length !== 0) {
    separateSections.forEach((separate) => {
      const slider = separate.querySelector('.separate-slider.swiper');
      if (!slider) {
        return;
      }

      const paginationContainer = separate.querySelector(
        '.separate-header .separate-header__btn__container'
      );
      if (!paginationContainer) {
        return;
      }

      const bulletContentArray =
        paginationContainer.querySelectorAll('.separate-bullet');
      if (bulletContentArray.length === 0) {
        return;
      }

      const swiperInit = new Swiper(slider, {
        effect: 'fade',
        autoHeight: true,
        allowTouchMove: false,
        slidesPerView: 1,
        spaceBetween: 30,
        pagination: {
          el: paginationContainer,
          clickable: true,
          renderBullet: function (index, className) {
            return `
              <button class="${className} _btn separate-bullet ${
              index % 2 !== 0 ? '_reverse' : ''
            }">
                  ${
                    bulletContentArray[index]
                      ? bulletContentArray[index].innerHTML
                      : 'category'
                  }
              </button>
            `;
          },
        },
      });

      separateSlidersArray.push(swiperInit);
    });
  }
});
