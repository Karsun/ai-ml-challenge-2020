import html
import re
from io import StringIO
import streamlit as st
import streamlit.components.v1 as components
from bs4 import BeautifulSoup
from tika import parser  # pip install tika
import predictor

FILE_TYPES = ["pdf", "docx"]
html_text = ""
regex_for_parsing_sections = None

st.set_option('deprecation.showfileUploaderEncoding', False)

st.title('GSA AI/ML EULA Challenge 2020 - KARSUN Response')

st.subheader('EULA Terms & Conditions Assessment')


def _max_width_():
    # Function to set the up in wide mode
    max_width_str = f"max-width: 2000px;"
    st.markdown(
        f"""
    <style>
    .reportview-container .main .block-container{{
        {max_width_str}
    }}
    </style>    
    """,
        unsafe_allow_html=True,
    )


def remove_header_footer(xml_data):
    # Function to remove header and footer from the text data
    xhtml_data = BeautifulSoup(xml_data['content'])
    page0 = None
    all_pages = ""
    total_pages = 0
    all_pages_enum = xhtml_data.find_all('div', attrs={'class': 'page'})
    if len(all_pages_enum) <= 0:
        return xhtml_data.getText()
    total_pages = len(all_pages_enum)
    page_to_select = int(round(total_pages / 2))

    for page, content in enumerate(all_pages_enum):
        _buffer = StringIO()
        _buffer.write(str(content))
        parsed_content = parser.from_buffer(_buffer.getvalue())
        all_pages = all_pages + parsed_content['content'].strip()
        if page == page_to_select:
            page0 = parsed_content['content']

    first_page_split = page0.split("\n")

    for page_str in first_page_split:
        if len(page_str.rstrip()) > 0:
            page_str = re.escape(page_str)
            page_str = re.sub(r'\d+', '\\\\d+', page_str)
            list_of_instances = [m.start() for m in re.finditer(page_str + "[\r\n]", all_pages)]
            if len(list_of_instances) > round(total_pages / 2):
                all_pages = re.sub(page_str + "[\r\n]", '', all_pages)
    return all_pages


def processSection(section, split_data):
    # Function to process section of data within header sections
    global regex_for_parsing_sections
    if section.find(".") == 0:
        section = section[1:]
    title = section.find(".", section.find(".") + 1)
    if title >= 0:
        split_data.append("Title:" + section[0:title])
        section = section[title + 1:]
    prev_section_item = None
    if regex_for_parsing_sections is None:
        regex_for_parsing_sections = '(\\n[a-z]{1,4}\\.\\s\\D)'
        list_of_paragraphs = [(n.start(0), n.end(0)) for n in re.finditer(regex_for_parsing_sections, section)]
        list_of_paragraphs_num = [(n.start(0), n.end(0)) for n in re.finditer('(\\n[0-9.]{1,4}\\.?\\s)', section)]
        if len(list_of_paragraphs_num) > len(list_of_paragraphs):
            regex_for_parsing_sections = "(\\n[0-9.]{1,4}\\.?\\s)"
    list_of_paragraphs = [(n.start(0), n.end(0)) for n in re.finditer(regex_for_parsing_sections, section)]
    for dataSection in list_of_paragraphs:
        if prev_section_item is None:
            prev_section_item = dataSection
            continue
        split_data.append(section[prev_section_item[0]:dataSection[0] - 1])
        prev_section_item = dataSection
    if prev_section_item is None:
        split_data.append(section)
    if prev_section_item is not None: 
        split_data.append(section[prev_section_item[0]:])
    return split_data


def processFile(uploaded_file_data):
    # Function to process the uploaded file
    global regex_for_parsing_sections
    regex_for_parsing_sections = None
    xml_content = parser.from_buffer(uploaded_file_data, xmlContent=True)
    text = remove_header_footer(xml_content)
    split_data = []
    text = re.sub('\n+', '\n', text)
    prev_item = None
    for data in [(m.start(0), m.end(0)) for m in re.finditer('\\n[0-9]+\\.\\s\\D', text)]:
        if prev_item is None:
            prev_item = data
            continue

        section = text[prev_item[0]:data[0] - 1]
        split_data = processSection(section, split_data)
        prev_item = data
    if prev_item is not None:
        split_data = processSection(text[prev_item[0] - 1:], split_data)
    if prev_item is None:
        split_data.append(text)
    displayData(split_data)
    return


def displayData(split_data):
    # Function to display data which has been split
    global html_text
    process_data = True
    processing_info = st.empty()
    progress_bar = st.empty()
    cancel_button = st.empty()
    bar = progress_bar.progress(0)
    cancel = cancel_button.button('Cancel Processing')
    if cancel:
        process_data = False
    html_text = """<!DOCTYPE html>
        <html>
        <head>
        <style>
        .pass { 
         color:black
        }
        .fail {
         color:red
        }
        .text-left {
            text-align: left;
        }
        table {
          font-family: arial, sans-serif;
          border-collapse: collapse;
          width: 100%;
        }

        td, th {
          border: 1px solid #dddddd;
          text-align: center;
          padding: 5px;
        }
        
        
        /*table thead tr{
            display:block;
        }

        table  tbody{
          display:block;
          height:380px;
          overflow:auto;//set tbody to auto
        }
        */
        .headers {
          background-color: #dddddd;
        }
        </style>
        </head>
        <body>


        <table width="100%">
          <thead>
          <tr>
            <th width="64%">Clause</th>
            <th width="11%">Acceptance Probability (%)</th>
            <th width="12%">Acceptable(0), Unacceptable(1)</th>
            <th width="11%">Disagree?</th>
          </tr></thead>
            <tbody>"""

    index_for_display = 0
    for data in split_data:
        index_for_display = index_for_display + 1
        if len(data) <= 0:
            continue
        if not process_data:
            break
        if data.find("Title:") >= 0:
            html_text = html_text + """
                       <tr class="headers">
                       <td colspan="4" class="text-left"> """ + data[6:] + """</td>
                       </tr>"""
        else:
            processing_info.text("Processing " + str(index_for_display) + " of " + str(len(split_data)) + " clauses")
            bar.progress(index_for_display/len(split_data))
            bar.progress(index_for_display / len(split_data))
            prediction_result = predictor.predict(data)
            df2 = prediction_result.iloc[[-1]]
            row_class = "pass"
            if df2['prediction'].values[0] == 1:
                row_class = "fail"
            html_text = html_text + """
            <tr class="""+row_class+""">
            <td width="65%" class="text-left"> """ + html.escape(data) + """</td>
            <td width="11%"> 
            """ + str(df2['acceptable_probability'].values[0]) + """</td>
            <td width="12%">""" + str(df2['prediction'].values[0]) + """</td>
            <td><span id='recording_"""+str(index_for_display)+"""' style='display:none'>Recorded</span><button 
            type="button" class="btn btn-warning" onclick="this.style.display = 'none';document.getElementById(
            'recording_"""+str(index_for_display)+"""').style.display = 'block'">Disagree</button></td> 
            </tr>"""
    html_text = html_text + """
        </tbody>
        </table>
        </body>
        </html>
        """
    processing_info.empty()
    progress_bar.empty()
    cancel_button.empty()
    st.subheader('Assessment Result')
    components.html(html_text, width=None, height=700, scrolling=True)


def main():
    # Function which is used to set up and start the application
    _max_width_()
    uploaded_file = st.file_uploader("Choose a PDF or DOCX file to assess", type=FILE_TYPES)
    if uploaded_file is not None:
        processFile(uploaded_file)


main()
