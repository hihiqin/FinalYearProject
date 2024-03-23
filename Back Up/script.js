document.addEventListener('DOMContentLoaded', function() {
    // Display CSV content in csvTextarea1 upon file selection
    var fileInput = document.getElementById('csvFileInput');
    fileInput.addEventListener('change', function() {
        var file = this.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                var content = e.target.result;
                var lines = content.split('\n');
    
                // Create a Table Element
                var table = document.createElement('table');
                table.setAttribute('border', '1');
    
                // Traverse every Line
                lines.forEach(function(line) {
                    var row = document.createElement('tr'); // Create a Table Line
                    var fields = line.split(','); 
    
                    // Traverse every field
                    fields.forEach(function(field) {
                        var cell = document.createElement('td'); // Create a Tble Data
                        cell.textContent = field; 
                        row.appendChild(cell); // 将单元格添加到当前行
                    });
    
                    table.appendChild(row); // 将当前行添加到table中
                });
    
                // 获取用于显示表格的div容器
                var displayArea = document.getElementById('csvDisplayArea');
                displayArea.innerHTML = ''; // 清空容器内的内容
                displayArea.appendChild(table); // 将新创建的表格添加到容器中
    
            };
            reader.readAsText(file);
        }
    });

    // Toggle accordion panels
    window.toggleAccordion = function(sectionId) {
        var panel = document.getElementById(sectionId);
        if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
        }
    };

    displayMatchingElements();
});

function loadCSV() {
    var fileInput = document.getElementById('csvFileInput');
    var file = fileInput.files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var content = e.target.result;
            var lines = content.split('\n');
            // 创建表格并添加标题行
            var table = document.createElement('table');
            table.setAttribute('border', '1');
            var headerRow = document.createElement('tr');
            ['Name', 'Group','Email', 'Date', 'Reason'].forEach(function(header) {
                var th = document.createElement('th');
                th.textContent = header;
                headerRow.appendChild(th);
            });
            table.appendChild(headerRow);

            // 解析第四行以获取日期数据
            var dateFields = lines[3].split(',');

            // 开始处理学生数据行，假设从第五行开始
            for (var i = 4; i < lines.length; i++) {
                var fields = lines[i].split(',');
                var reason = '';

                fields.forEach(function(field, index) {
                    if (field.includes('L (1/2)')) {
                        reason = 'Late';
                    } else if (field.includes('E (1/2)')) {
                        reason = 'Excused';
                    } else if (field.includes('A (0/2)')) {
                        reason = 'Absent';
                    }

                    if (reason) {
                        // 从日期行中获取相应列的日期并提取年份部分
                        var dateMatch = dateFields[index].match(/^(.*?20\d{2})/); // 匹配以"20"开头后跟两个数字的年份
                        var year = dateMatch ? dateMatch[0] : ''; // 如果匹配成功，使用匹配到的年份，否则使用空字符串
                        var tr = document.createElement('tr');
                        var name = fields[0] + ' ' + fields[1]; // firstName + lastName
                        var group = fields[2];
                        var email = fields[5];
                        [name,group, email, year, reason].forEach(function(text) {
                            var td = document.createElement('td');
                            td.textContent = text;
                            tr.appendChild(td);
                        });
                        table.appendChild(tr);
                        // 重置原因，为下一个可能的原因做准备
                        reason = '';
                    }
                });
            }

            // 将表格添加到指定的<div>中
            var displayArea = document.getElementById('csvTextarea2');
            displayArea.innerHTML = ''; // 清空可能存在的旧内容
            displayArea.appendChild(table);
        };
        reader.readAsText(file);
    }
}


function downloadCSV() {
    var table = document.getElementById("csvTextarea2").querySelector("table");
    
    // 检查是否存在表格
    if (!table) {
        // 如果没有表格，使用headersInfo提示用户
        alert("No File Selected");
    } else {
        // 将表格内容转换为CSV格式
        var rows = table.querySelectorAll("tr");
        var csvContent = Array.from(rows)
            .map(row => {
                var cells = row.querySelectorAll("th, td");
                return Array.from(cells).map(cell => `"${cell.textContent}"`).join(",");
            })
            .join("\n");

        // 创建一个隐藏的a标签用于下载
        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvContent);
        hiddenElement.target = '_blank';

        // 提供下载的文件名，使用下划线替换非法字符
        hiddenElement.download = 'lab_late_absent_excuse.csv';
        document.body.appendChild(hiddenElement);
        hiddenElement.click();
        document.body.removeChild(hiddenElement);
    }
}




// 等待DOM完全加载
document.addEventListener("DOMContentLoaded", function() {
    var mainContent = document.querySelector(".main-content");
    var calculateAverageScoreSection = document.querySelector('.calculate-average-score');
    var calculateGroupAttendanceSection = document.querySelector('.calculategroupattendance');
    var NoHiddenLab =  document.querySelector('.CalculateHiddenLab');
    document.getElementById("showMainContent").addEventListener("click", function() {  
        calculateGroupAttendanceSection.style.display = "none"; 
        calculateAverageScoreSection.style.display = "none"; 
        NoHiddenLab.style.display = "none";  

        if (mainContent.style.display === "none" || mainContent.style.display === "") {
            mainContent.style.display = "block";
        } else {
            mainContent.style.display = "none";
        }
    });

    document.getElementById('toggleScoreArea').addEventListener('click', function() {
        mainContent.style.display = "none";   
        calculateGroupAttendanceSection.style.display = "none";  
        NoHiddenLab.style.display = "none";    

        if (calculateAverageScoreSection.style.display === 'none' || calculateAverageScoreSection.style.display === '') {
            calculateAverageScoreSection.style.display = 'block';
        } else {
            calculateAverageScoreSection.style.display = 'none';
        }
    });
    document.getElementById('showMainContent2').addEventListener('click', function() {
        mainContent.style.display = "none";
        calculateAverageScoreSection.style.display = "none"; 
        NoHiddenLab.style.display = "none"; 

        if (calculateGroupAttendanceSection.style.display === 'none' || calculateGroupAttendanceSection.style.display === '') {
            calculateGroupAttendanceSection.style.display = 'block';
        } else {
            calculateGroupAttendanceSection.style.display = 'none';
        }
    });
    document.getElementById('NotHiddenLab').addEventListener('click', function() {
        mainContent.style.display = "none";
        calculateAverageScoreSection.style.display = "none"; 
        calculateGroupAttendanceSection.style.display = "none";  

        if (NoHiddenLab.style.display === 'none' || NoHiddenLab.style.display === '') {
            NoHiddenLab.style.display = 'block';
        } else {
            NoHiddenLab.style.display = 'none';
        }
    }); 

});

// .................................................................
// 获取文件输入元素
var fileInput = document.getElementById('uploadClassList');

// 文件选择后的处理
fileInput.addEventListener('change', function() {
    // 确保至少选择了一个文件
    if (fileInput.files.length > 0) {
        var file = fileInput.files[0]; // 获取上传的文件
        var reader = new FileReader();

        reader.onload = function(e) {
            var text = e.target.result;
            var classListCsvJson = csvToJson(text); // 转换CSV文本为JSON
            // console.log(classListCsvJson); // 在控制台输出解析得到的JSON
        };

        // 读取文件内容
        reader.readAsText(file);
    } else {
        console.log("No file selected!");
    }
});

function csvToJson(csv) {
    var lines = csv.split("\n");
    var result = [];
    var headers = lines[0].split(",");

    for (var i = 1; i < lines.length; i++) {
        var obj = {};
        var currentline = lines[i].split(",");

        for (var j = 0; j < headers.length; j++) {
            // 检查 currentline[j] 是否存在，如果不存在则设置为空字符串
            obj[headers[j].trim()] = currentline[j] ? currentline[j].trim() : "";
        }

        // 如果对象不是完全由空字符串组成，则添加到结果中
        if (Object.values(obj).some(value => value !== "")) {
            result.push(obj);
        }
    }

    return result; // 返回JSON对象数组
}




document.addEventListener('DOMContentLoaded', function() {
    var csvAttendancePercentageInput = document.getElementById('csvAttendancePercentageInput');
    csvAttendancePercentageInput.addEventListener('change', function() {
        var file = this.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                var content = e.target.result;
                var lines = content.split('\n');

                // Create a new table element
                var table = document.createElement('table');
                table.setAttribute('border', '1');

                // Iterate through each line
                lines.forEach(function(line) {
                    var row = document.createElement('tr'); // Create a new tr element
                    var fields = line.split(','); // Split each line by comma

                    // Iterate through each field
                    fields.forEach(function(field) {
                        var cell = document.createElement('td'); // Create a new td element
                        cell.textContent = field; // Set cell content
                        row.appendChild(cell); // Add the cell to the current row
                    });

                    table.appendChild(row); // Add the current row to the table
                });

                // Get the div container for displaying the table
                var displayArea = document.getElementById('csvAttendancePercentageDisplay');
                displayArea.innerHTML = ''; // Clear any existing content in the container
                displayArea.appendChild(table); // Add the new table to the container
            };
            reader.readAsText(file);
        }
    });
});


document.addEventListener('DOMContentLoaded', function() {
    var csvHiddenInput = document.getElementById('csvHiddenInput');
    csvHiddenInput.addEventListener('change', function() {
        var file = this.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                var content = e.target.result;
                var lines = content.split('\n');

                // Create a new table element
                var table = document.createElement('table');
                table.setAttribute('border', '1');

                // Iterate through each line
                lines.forEach(function(line) {
                    var row = document.createElement('tr'); // Create a new tr element
                    var fields = line.split(','); // Split each line by comma

                    // Iterate through each field
                    fields.forEach(function(field) {
                        var cell = document.createElement('td'); // Create a new td element
                        cell.textContent = field; // Set cell content
                        row.appendChild(cell); // Add the cell to the current row
                    });

                    table.appendChild(row); // Add the current row to the table
                });

                // Get the div container for displaying the table
                var displayArea = document.getElementById('csvhiddenDisplay');
                displayArea.innerHTML = ''; // Clear any existing content in the container
                displayArea.appendChild(table); // Add the new table to the container
            };
            reader.readAsText(file);
        }
    });
});

document.getElementById('csvAttendancePercentageInput').addEventListener('change', function(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent) {
        const text = fileLoadedEvent.target.result;
        document.getElementById('csvAttendancePercentageDisplay').textContent = text;
        document.getElementById('csvAttendancePercentageResult').style.display = 'none';
        processCSVData(text);
    };
    fileReader.readAsText(event.target.files[0], "UTF-8");
});

function processCSVData(csvData) {
    const lines = csvData.split('\n');
    let totalEligibleStudents = 0;
    let studentsWith100Percent = 0;
    let totalExcludingSpecial = 0;
    let studentsWith100PercentEx = 0;
    const groupTotalStudents = {};
    const groupStudentsWith100Percent = {};

    lines.forEach((line) => {
        const columns = line.split(',');
        if (columns.length > 54) {
            totalEligibleStudents++;
            const attendancePercentageStr = columns[54].trim();
            const has100Percent = "100" === attendancePercentageStr;

            if (has100Percent) {
                studentsWith100Percent++;
            }

            const groups = columns[2].trim();
            const isExcludedGroup = groups.includes("Demonstrator") || groups.includes("CSC Tutors") || groups === "" || groups.includes("0");

            if (!isExcludedGroup) {
                totalExcludingSpecial++;
                if (has100Percent) {
                    studentsWith100PercentEx++;
                }
            }

            const groupsArray = groups.split(',');
            if (groupsArray.length > 0) {
                const firstGroup = groupsArray[0].trim();
                if (["Red", "Blue", "Yellow", "Green"].includes(firstGroup)) {
                    groupTotalStudents[firstGroup] = (groupTotalStudents[firstGroup] || 0) + 1;
                    if (has100Percent) {
                        groupStudentsWith100Percent[firstGroup] = (groupStudentsWith100Percent[firstGroup] || 0) + 1;
                    }
                }
            }
        }
    });

    // 开始构建表格HTML
    let tableHTML = '<table border="1"><tr><th>Groups</th><th>Percentage</th></tr>';
    
    // 添加全体成员100%出勤率
    tableHTML += `<tr><td>All Eligible Members and Demons with 100% Attendance</td><td>${((studentsWith100Percent / totalEligibleStudents) * 100).toFixed(2)}%</td></tr>`;
    
    // 添加除特定组外的成员100%出勤率
    tableHTML += `<tr><td>All Eligible Students Excluding 'Demonstrator', 'CSC Tutors', and Blank Groups with 100% Attendance</td><td>${((studentsWith100PercentEx / totalExcludingSpecial) * 100).toFixed(2)}%</td></tr>`;
    
    // 为每个特定组添加行
    ["Red", "Blue", "Yellow", "Green"].forEach(group => {
        const totalInGroup = groupTotalStudents[group] || 0;
        const with100InGroup = groupStudentsWith100Percent[group] || 0;
        const percentageWith100 = ((with100InGroup / totalInGroup) * 100).toFixed(2);
        tableHTML += `<tr><td>Eligible Students in Group ${group} with 100% Attendance</td><td>${percentageWith100}%</td></tr>`;
    });
    
    // 完成表格HTML构建
    tableHTML += '</table>';

    // 设置表格HTML到结果区域
    document.getElementById('csvAttendancePercentageResult').innerHTML = tableHTML;
}


function uploadAttendancePercentageCSV() {
    // 假设处理函数已经被调用，所以这里不需要做什么
    // 但如果你想在这里隐藏或显示某些UI元素，可以在这里添加代码
    // 例如，确保结果区域是可见的
    document.getElementById('csvAttendancePercentageResult').style.display = 'block';
}

function downloadAttendancePercentageCSV() {
    // 检查是否已经选择了文件
    const fileInput = document.getElementById('csvAttendancePercentageInput');
    if (!fileInput.files.length) {
        // 如果没有选择文件，则显示警告
        alert('Please choose your file.');
        return; // 提前返回，不执行后续代码
    }

    // 如果文件已选择，则继续执行原有的下载逻辑
    const data = document.getElementById('csvAttendancePercentageResult').textContent;
    if (!data) {
        // 如果没有数据（即用户没有点击"Upload CSV"），也显示警告
        alert('Please upload your file first.');
        return;
    }

    const blob = new Blob([data], {type: 'text/csv'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'Group_attendance_percentage_result.csv';
    link.href = url;
    document.body.appendChild(link); // 需要添加到文档中才能正常工作
    link.click(); // 触发下载
    document.body.removeChild(link); // 下载后就不需要这个元素了
}

// 定义两个数组来存储特定列的数据
var classListFifthColumn = [];
var labInfoSecondColumn = [];

// Input Class List in left textbox
document.getElementById('uploadClassList').addEventListener('change', function(e) {
    var file = e.target.files[0];
    var reader = new FileReader();
    
    reader.onload = function(e) {
        var contents = e.target.result;
        var lines = contents.split('\n');
        var table = '<table border="1">';

        classListFifthColumn = []; // 清空数组以存储新数据
        
        lines.forEach(function(line, index) {
            var values = line.split(',');
            if (values.length < 5) { // 确保每行至少有5列
                // 如果列数不足，可以选择在这里处理，例如跳过该行或添加默认值
                return; // 这里选择跳过该行
            }

            if (index === 0) { // 对于标题行
                // 使用 <th> 标签并应用加粗样式
                table += '<tr>' + values.map(function(header) {
                    return '<th><strong>' + header.trim() + '</strong></th>';
                }).join('') + '</tr>';
            } else {
                table += '<tr>';
                
                values.forEach(function(value, colIndex) {
                    if (colIndex === 4) { // 第五列，index为4
                        // 存储第五列的数据，忽略大小写并去除空格
                        classListFifthColumn.push(value.trim().toLowerCase());
                    }
                    table += '<td>' + value + '</td>';
                });
                
                table += '</tr>';
            }
        });
        
        table += '</table>';
        document.getElementById('classListArea').innerHTML = table; // 将生成的表格显示在页面上
    };
    
    reader.readAsText(file); // 读取文件内容
});


// 修改：定义一个映射，存储labInfo中每个邮箱对应的整行数据
var labInfoRowsByEmail = {};
// 定义一个数组来存储每一列标题的长度
var headersInfo = [];

// Input Lab Info in right textbox
document.getElementById('uploadLabInfo').addEventListener('change', function(e) {
    var file = e.target.files[0];
    var reader = new FileReader();
    
    reader.onload = function(e) {
        var contents = e.target.result;
        var lines = contents.split('\n');
        var table = '<table border="1">';

        labInfoRowsByEmail = {}; // 重置映射
        labInfoSecondColumn = []; // 清空数组以存储新数据
        headersInfo = []; // 
        
        lines.forEach(function(line, index) {
            var values = line.split(',');

                if (index === 0) { // 检测标题行
                    // 存储每一列标题的名字和长度
                    headersInfo = values.map(value => 
                        ({ name: value.trim(), length: value.trim().length, scoreCount : 0 })
                    );
                    // 对标题行应用加粗样式
                    table += '<tr><th>' + values.map(value =>  
                        '<strong>' + value.trim() + '</strong>'
                    ).join('</th><th>') + '</th></tr>';
                } else if (values.length > 1) { // 确保每行至少有两列
                    // 存储整行数据到映射中，以第二列（邮箱）为键
                    var email = values[1].trim().toLowerCase();
                    labInfoRowsByEmail[email] = values;
                    
                    table += '<tr>';
                    values.forEach(function(value, colIndex) {
                        if (colIndex === 1) { // 第二列，index为1
                            labInfoSecondColumn.push(email); // 存储第二列的数据，忽略大小写并去除空格
                        }
                        table += '<td>' + value + '</td>';
                    });
                    table += '</tr>';
                }
            
        });
        
        table += '</table>';
        document.getElementById('labInfoArea').innerHTML = table;
    };
    
    reader.readAsText(file);
});


document.getElementById('calculateAvgScore').addEventListener('click', function() {
    displayMatchingElements();
});

// 保持之前定义的 displayMatchingElements 函数不变
function displayMatchingElements() {
    var displayContent = '';
    var selectedMultiplier = document.querySelector('input[name="multiplier"]:checked').value;
    var displayContent = `<b>Colored labs accounted for ${selectedMultiplier} Times </b> <br><br>`;
    
    classListFifthColumn.forEach(function(email) {
        if (labInfoSecondColumn.includes(email)) {
            var rowData = labInfoRowsByEmail[email];
            var totalScore = 0;  // 用于累加所有加权分数
            var totalWeight = 0; // 用于累加所有权重
            var qualifyingHeaderName = ''; // 用于存储符合条件的第一个标题名

            rowData.slice(2).forEach((cell, index) => {
                var cellValue = cell.trim();
                var isNumber = cellValue !== '' && !isNaN(cellValue);
                var header = headersInfo[index + 2]; // 加2是因为我们从第三列开始

                // // Some People forget to do Basic Assignments
                // if (header.lenght < 10 && !isNumber){
                //     totalWeight = totalWeight + 1;
                // }

                if (isNumber) {
                    if (header.length > 10 && qualifyingHeaderName === '') {
                        header.scoreCount++; // 对应列的成绩数量加1
                        var splitHeader = header.name.split('-');
                        qualifyingHeaderName = splitHeader[splitHeader.length - 1].trim(); // 只取"-"符号右侧的内容
                    }

                    var weight = header.length < 10 ? 1 : parseFloat(selectedMultiplier); // 根据列标题长度设置权重
                    
                    totalScore += parseFloat(cellValue) * weight; // 累加加权分数
                    totalWeight += weight; // 累加权重
                }
            });
            
            // // Some People forget to do Colored Assignments
            // while(totalWeight < 4 + 2 * parseFloat(selectedMultiplier)){
            //     totalWeight = totalWeight + parseFloat(selectedMultiplier)
            // }            

            // if (email == "lauren.mullally.2022@mumail.ie"){
            //     alert(totalWeight);
            //     alert(totalScore);
            // }

            // 计算加权平均值
            var weightedAverage = totalScore / totalWeight;
            if (weightedAverage == '0.00') {
                displayContent += `<span style="background-color: red; color: white;">${email}: absenteeism</span><br>`;
            } else {
                displayContent += `${email} [${qualifyingHeaderName}]: ${weightedAverage.toFixed(2)}<br>`;
            }
        }
    });

    document.getElementById('avgScoreDisplayArea').innerHTML = displayContent;
}

// 添加事件监听器到单选按钮，以便在选项变化时自动更新显示内容
document.querySelectorAll('input[name="multiplier"]').forEach(radio => {
    radio.addEventListener('change', () => {
        displayMatchingElements();
    });
});