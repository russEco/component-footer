import React from 'react';
import Icon from '@economist/component-icon';
const iconSize = '38px';
export function targetIfNeeded({ internal }) {
  if (internal === false) {
    return { target: '_blank' };
  }
  return {};
}

export function renderListOfLinks(listOfLinks, {
  useIcons = false,
  iconColor = '#B6B6B6',
} = {}) {
  return listOfLinks.map((link, index) => {
    let linkContents = link.title;
    if (useIcons) {
      linkContents = <Icon icon={link.meta} color={iconColor} size={iconSize} />;
    }
    if (link.internal === false) {
      return (
        <li className="list__item" key={index}>
          <a
            className="ec-footer__link ec-footer__link--external"
            href={link.href}
            target="_blank"
          >
            {linkContents}
          </a>
        </li>
      );
    }
    return (
      <li className="list__item" key={index}>
        <a className="ec-footer__link" href={link.href} key={index}>
          {linkContents}
        </a>
      </li>
    );
  });
}

export function renderSocialListContent(listOfLinks) {
  const allExceptMail = listOfLinks.filter(({ meta }) => meta !== 'mail');
  return renderListOfLinks(allExceptMail, { useIcons: true });
}

export function renderNewsletterLink(social) {
  const newsletter = social.filter(({ meta }) => meta === 'mail')[0] || null;
  if (!newsletter) {
    return [];
  }
  return (
    <a className="ec-footer__link ec-footer__subscribe-newsletter-link"
      href={newsletter.href} {...targetIfNeeded(newsletter)}
    >
      <Icon icon="mail"
        className="ec-footer__subscribe-newsletter-icon" color="#B6B6B6"
        size={iconSize}
      />
      {newsletter.title}
    </a>
  );
}

export default function Footer({
  data = null, // eslint-disable-line
  quote = null,
  quoteNoMobile = false,
}) {
  if (quote) {
    const quoteParagraph = () => ({
      __html: quote, // eslint-disable-line
    });
    let quoteClassNames = [ 'ec-footer__quote' ];
    if (quoteNoMobile) {
      quoteClassNames = quoteClassNames.concat([ 'ec-footer__quote--no-mobile' ]);
    }
    /* eslint-disable react/no-danger */
    quote = (
      <div className={quoteClassNames.join(' ')}>
        <p
          className="ec-footer__quote-paragraph"
          dangerouslySetInnerHTML={quoteParagraph()}
        />
      </div>
    );
    /* eslint-enable react/no-danger */
  }

  const listsOfLinks = data; // eslint-disable-line
  const currentYear = new Date().getFullYear();
  return (
    <footer className="ec-footer">
      <div className="ec-footer__wrapper">
        <div className="ec-footer__menu">
          <div className="ec-footer__list ec-footer__list--subs">
            <ul className="list">
              {renderListOfLinks(listsOfLinks.customer)}
            </ul>
          </div>
          <div className="ec-footer__list ec-footer__list--social">
            <h4 className="ec-footer__header">Keep updated</h4>
            <ul className="list">
              {renderSocialListContent(listsOfLinks.social)}
            </ul>
            {renderNewsletterLink(listsOfLinks.social)}
          </div>
          <div className="ec-footer__list ec-footer__list--economist">
            <ul className="list">
              {renderListOfLinks(listsOfLinks.economist)}
            </ul>
          </div>
        </div>
        {quote}
        <div className="ec-footer__footnote">
          <div className="ec-footer__list ec-footer__list--footnote">
            <ul className="list">
              {renderListOfLinks(listsOfLinks.business)}
            </ul>
          </div>
          <p className="ec-footer__copyright">
            Copyright © The Economist Newspaper Limited {currentYear}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

if (process.env.NODE_ENV !== 'production') {
  Footer.propTypes = {
    data: React.PropTypes.shape({ // eslint-disable-line
      customer: React.PropTypes.arrayOf(React.PropTypes.object),
      economist: React.PropTypes.arrayOf(React.PropTypes.object),
      social: React.PropTypes.arrayOf(React.PropTypes.object),
      business: React.PropTypes.arrayOf(React.PropTypes.object),
    }),
    quote: React.PropTypes.string,
    quoteNoMobile: React.PropTypes.bool,
  };
}
