// ResizeableBox from react-charts examples
// https://github.com/tannerlinsley/react-charts/blob/beta/examples/simple/src/ResizableBox.js
import React from 'react';
import {ResizableBox as ReactResizableBox} from 'react-resizable';

import 'react-resizable/css/styles.css';

interface Props {
    children: [] | any,
    width?: number,
    height?: number,
    resizable?: boolean,
    style?: Object,
    className?: string,
}

/**
 * Create a component that acts as a rezizeable box on the screen.
 * @param {Object} param0 - input parameters for constructing the box
 * @return {Object}
 */
export default function ResizableBox({
  children,
  width = 600,
  height = 300,
  resizable = true,
  style = {},
  className = '',
}: Props) {
  return (
    <div style={{marginLeft: 20}}>
      {resizable ? (
        <ReactResizableBox width={width} height={height}>
          <div
            style={{
              boxShadow: '0 20px 40px rgba(0,0,0,.1)',
              ...style,
              width: '100%',
              height: '100%',
            }}
            className={className}
          >
            {children}
          </div>
        </ReactResizableBox>
      ) : (
        <div
          style={{
            width: `${width}px`,
            height: `${height}px`,
            boxShadow: '0 20px 40px rgba(0,0,0,.1)',
            ...style,
          }}
          className={className}
        >
          {children}
        </div>
      )}
    </div>
  );
}
