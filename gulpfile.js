const gulp = require('gulp');
const sass = require('gulp-sass');
const replace = require('gulp-replace');
const rename = require('gulp-rename');
const clean = require('gulp-clean');
const tap = require('gulp-tap');
const path = require('path');
const config = require('./build/config');
const watch = require('gulp-watch');
const fs = require('fs');
const stream = require('stream');

// 所有的样式文件都是sass文件，除了存放sass变量和sass函数的sass文件，不需要注释掉import语句外
// 其他的都需要注释掉，编译成单独的文件，
// 这样防止了单文件wxss过大的问题

const hasRmCssFiles = new Set();

async function proCompile () {
    try {
        await devCopyFile();
        return await devCompileScss();
    } catch (error) {
        console.warn('构建报错了_____',error);
        return Promise.reject(error);
    }
}

function devCopyFile () {
    return gulp.src(['./src/**','!./src/**/*.{scss,wxss}']).pipe(gulp.dest('./dist'));
}

function devCompileScss () {
    return gulp.src('./src/**/*.{scss,wxss}').pipe(tap((file) => {
        // 当前处理文件的路径
        const filePath = path.dirname(file.path);
        // 当前处理内容
        const content = file.contents.toString();
        // 找到filter的scss，并匹配是否在配置文件中
        content.replace(/@import\s+['|"](.+)['|"];/g, ($1, $2) => {
            // /@import\s+['|"](.+)['|"];/g 匹配 import语句。 $2就是这个语句后面的文件路径

            const hasFilter = config.cssFilterFiles.filter(item => $2.indexOf(item) > -1);
            // hasFilter > 0表示filter的文件在配置文件中，打包完成后需要删除

            // 将需要删掉的文件放到dist目录下面去
            if (hasFilter.length > 0) {
                const rmPath = path.join(filePath, $2);
                // 将src改为dist，.scss改为.wxss，例如：'/xxx/src/scss/const.scss' => '/xxx/dist/scss/const.wxss'
                const filea = rmPath.replace(/src/, 'dist').replace(/\.scss/, '.wxss');
                // 加入待删除列表
                hasRmCssFiles.add(filea);
            }

        });
    }))
    .pipe(replace(/(@import.+;)/g, ($1, $2) => {
        // 这个函数的逻辑是注释掉import语句

        const hasFilter = config.cssFilterFiles.filter(item => $1.indexOf(item) > -1);
        if (hasFilter.length > 0) {
            return $2;
        }
        return `/** ${$2} **/`;
    }))
    .pipe(sass().on('error', sass.logError))
    .pipe(replace(/(\/\*\*\s{0,})(@.+)(\s{0,}\*\*\/)/g, ($1, $2, $3) => $3.replace(/\.scss/g, '.wxss')))
    .pipe(rename({
        extname: '.wxss',
    }))
    .pipe(gulp.dest('./dist'));
}

gulp.task('build', () => {
    return proCompile()
})

gulp.task('clean:wxss', () => {
    const arr = [];
    hasRmCssFiles.forEach((item) => {
        arr.push(item);
    });
    return gulp.src(arr, {
            read: false
        })
        .pipe(clean({
            force: true
        }));
});

gulp.task('default', function () {
    watch('./src/**', (vinyl) => {
        let targetPath = path.normalize(vinyl.path.replace(/src/g, 'dist'));
        let targetDir = path.dirname(targetPath);
        let readStream = null;
        
        if (vinyl.contents === null) {
            delFile(targetPath);
        } else {
            // 如果改的是scss文件就编译复制 如果不是就直接复制到dist
            if (vinyl.path.indexOf('.scss') > 0) {
                readStream = gulp.src(vinyl.path);
                devCompile(readStream, targetDir);
            } else {
                readStream = new stream.PassThrough();
                readStream.end(vinyl.contents);
                copyFile(readStream, targetPath);
            }
        }
        
    });
    return true
})

function copyFile(bufferStream, dist) {
    const dir = path.dirname(dist);
    if (!fs.existsSync(dir)) {
        makeDir(dir);
    }
    bufferStream.pipe(fs.createWriteStream(dist));
}



const dirSet = new Set();
// 递归创建文件
function makeDir (dir) {
    if (!fs.existsSync(dir)) {
        dirSet.add(dir);
        makeDir(path.join(dir, '../'));
    } else {
        [...dirSet].reverse().forEach((dir) => {
            fs.mkdirSync(dir);
        });
        dirSet.clear();
    }
}

function delFile (path) {    
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }
}


// 这个函数是开发环境下的编译
function devCompile(stream, dist) {
    stream.pipe(replace(/(@import.+;)/g, ($1, $2) => { 
            const hasFilter = config.cssFilterFiles.filter(item => $1.indexOf(item) > -1);
            if (hasFilter.length > 0) {
                return $2;
            }
            return `/** ${$2} **/`;
        }))
        .pipe(sass().on('error', sass.logError))
        .pipe(replace(/(\/\*\*\s{0,})(@.+)(\s{0,}\*\*\/)/g, ($1, $2, $3) => $3.replace(/\.scss/g, '.wxss')))
        .pipe(rename({extname: '.wxss'}))
        .pipe(gulp.dest(dist))
}