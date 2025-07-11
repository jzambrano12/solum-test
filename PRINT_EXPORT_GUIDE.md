# PDF Export Guide

## Overview

The Analytics page now includes a comprehensive PDF export functionality that allows users to generate professional reports of all performance metrics.

## How to Use

### 1. Export Button

- Navigate to the Analytics page (`/dashboard/analytics`)
- Look for the "Export PDF" button in the top-right corner
- Click the button to trigger the export process

### 2. Browser Print Dialog

- After clicking "Export PDF", your browser's print dialog will open
- Make sure to select:
  - **Destination**: "Save as PDF" or "Microsoft Print to PDF"
  - **Layout**: Portrait (recommended)
  - **Paper size**: A4 (recommended)
  - **Margins**: Default or Custom (0.5 inches)
  - **Options**: Enable "Background graphics" for better visual results

### 3. What Gets Exported

The PDF will include:

- **Header**: Company name, report title, and generation timestamp
- **Filter Information**: Applied filters and total agent count
- **Overview Metrics**: Key performance indicators in a compact format
- **Quality Distribution**: Visual breakdown of call quality metrics
- **Top Performers**: Ranking of best performing agents
- **Company Performance**: Aggregated metrics by company
- **Needs Attention**: Agents requiring improvement
- **Detailed Metrics Table**: Complete breakdown of all agent metrics

### 4. Print Optimization

The export is optimized for:

- **Clean Layout**: Removes navigation, buttons, and interactive elements
- **Professional Formatting**: Uses print-friendly fonts and spacing
- **Proper Page Breaks**: Ensures content flows well across pages
- **Readable Tables**: Tables are formatted for maximum readability
- **Visual Elements**: Progress bars and quality indicators are clearly visible

## Technical Details

### CSS Print Styles

The implementation uses CSS `@media print` rules to:

- Hide interactive elements (buttons, filters, navigation)
- Optimize layout for A4 paper size
- Ensure proper contrast and readability
- Maintain visual hierarchy with appropriate font sizes
- Add page break controls for better formatting

### JavaScript Functionality

The export function:

- Adds timestamp and filter information to the PDF
- Triggers the browser's native print dialog
- Cleans up temporary elements after export
- Provides a seamless user experience

## Best Practices

1. **Apply Filters First**: Set up your desired filters before exporting
2. **Check Data Load**: Ensure all metrics are loaded before exporting
3. **Browser Compatibility**: Works best with Chrome, Firefox, Safari, and Edge
4. **Print Preview**: Use your browser's print preview to verify layout
5. **Save Options**: Choose "Save as PDF" for best results

## Troubleshooting

### Common Issues:

- **Missing Content**: Ensure all data is loaded before clicking export
- **Poor Quality**: Enable "Background graphics" in print settings
- **Cut-off Content**: Adjust margins or use A4 paper size
- **Missing Colors**: Check browser print settings for color options

### Browser-Specific Notes:

- **Chrome**: Best overall compatibility and print quality
- **Firefox**: May require enabling background graphics
- **Safari**: Works well on macOS with default settings
- **Edge**: Similar to Chrome functionality

## Future Enhancements

Potential improvements for future versions:

- Custom date range selection for reports
- Logo integration for company branding
- Multiple export formats (Excel, CSV)
- Scheduled report generation
- Email delivery options
