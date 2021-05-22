import React from 'react';

// render - передаем любую функцию
export default function ListItem({ item, render }) {
  const content = render(item);

  return <li className={'list-group-item ' + (item.isActive === true ? 'activeItem' : '')}>{content}</li>;

}
