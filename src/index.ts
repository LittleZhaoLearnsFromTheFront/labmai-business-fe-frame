import fs from "node:fs"
import path from "node:path"
import minimist from 'minimist'
import prompts from 'prompts'
import {
    blue,
    green,
    yellow,
    magenta,
    lightBlue,
    lightGreen
} from 'kolorist'
import { fileURLToPath } from 'node:url'

//声明 argv 快捷命令
const argv = minimist(process.argv.slice(2), { string: ["_"] })
const cwd = process.cwd()

const FRAMEWORKS = [
    {
        name: 'react',
        title: 'React',
        template: 'react',
        color: green
    },
    {
        name: 'react-ts',
        title: 'React-Ts',
        template: 'react-ts',
        color: blue
    },
    {
        name: 'react-labmai',
        title: 'React-Labmai',
        template: 'react-labmai',
        color: lightBlue
    },
    {
        name: 'react-promotion',
        title: 'React-Promotion',
        template: 'react-promotion',
        color: lightGreen
    },
]

const defaultProjectDir = 'labmai-vite-project'
const renameFiles: {
    [key: string]: string
} = {
    '_gitignore': '.gitignore'
}

const getConfigJSON = (projectName: string): { [key: string]: string } => {
    return {
        "VITE_PROMOTION_VERSION": projectName
    }
}

const init = async () => {
    const argvProjectDir = formatTargetDir(argv._[0])

    const argvProjectTemplate = argv.template
    const argvOverwrite = argv.overwrite

    let targetDir = argvProjectDir || defaultProjectDir

    let result: prompts.Answers<
        'projectName' | 'overwrite' | 'packageName' | 'template'
    >
    prompts.override({
        overwrite: argvOverwrite
    })

    try {
        result = await prompts([
            {
                name: 'projectName',
                type: argvProjectDir ? null : 'text',
                message: yellow('项目名称: '),
                initial: targetDir,
                onState: ({ value }) => targetDir = formatTargetDir(value) || defaultProjectDir
            },
            {
                name: 'overwrite',
                type: (_, { projectName = targetDir }) => !fs.existsSync(path.resolve(cwd, projectName)) || isEmpty(path.resolve(cwd, projectName)) ? null : 'select',
                message: yellow(`目标目录 "${targetDir}"` +
                    `不为空。请选择处理方式: `),
                choices: [
                    {
                        value: 'delete',
                        title: '删除现有文件并继续'
                    },
                    {
                        value: 'cancel',
                        title: '取消操作'
                    },
                    {
                        value: 'ignore',
                        title: '忽略文件并继续'
                    }
                ],
            },
            {
                name: 'packageName',
                type: (_, { overwrite }) => overwrite === 'cancel' || isValidPackageName(targetDir) ? null : 'text',
                message: yellow('PackageName:'),
                initial: () => toValidPackageName(targetDir),
                validate: (dir) =>
                    isValidPackageName(dir) || 'Invalid package.json name',
            },
            {
                name: 'template',
                type: (_, { overwrite }) => overwrite === 'cancel' || argvProjectTemplate ? null : 'select',
                message: yellow('项目模版: '),
                choices: FRAMEWORKS.map(t => ({ value: t.template, title: t.title }))
            }
        ])
        const { projectName = targetDir, packageName, template, overwrite } = result
        const root = path.resolve(cwd, projectName)

        if (overwrite === 'delete') {
            emptyMkdir(root)
        } else if (overwrite === 'ignore') {
            ignoreMkdir(root)
        } else if (overwrite === 'cancel') {
            process.exit(1)
        } else if (!fs.existsSync(root)) {
            fs.mkdirSync(root, { recursive: true })
        }


        const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent ?? "")
        const pkgManager = pkgInfo ? pkgInfo.name ?? 'npm' : 'npm'

        console.log(`\nScaffolding project in ${root}...`)

        const templateDir = path.resolve(fileURLToPath(import.meta.url), `../../template-${template}`)
        write(templateDir, root, {
            packageName: packageName ?? projectName ?? argvProjectDir,
            projectName: projectName
        })

        const cdProjectName = path.relative(cwd, root)
        console.log(`\nDone. Now run:\n`)
        if (root !== cwd) {
            console.log(
                magenta(`  cd ${cdProjectName.includes(' ') ? `"${cdProjectName}"` : cdProjectName
                    }`),
            )
        }
        switch (pkgManager) {
            case 'yarn':
                console.log(magenta('  yarn'))
                console.log(magenta('  yarn dev'))
                break
            default:
                console.log(magenta(`  ${pkgManager} install`))
                console.log(magenta(`  ${pkgManager} run dev`))
                break
        }

    } catch (e: any) {
        console.log(e.message);
    }

}

const formatTargetDir = (dir?: string) => {
    // 创建文件夹时 不能有 /
    return dir?.trim().replace(/\/+$/g, '')
}
//判断创建时，dir重名 dir中是否为空
const isEmpty = (path: string) => {
    const files = fs.readdirSync(path)
    return files.length === 0 || (files.length === 1 && files[0] === '.git')
}

const emptyMkdir = (dir: string) => {
    if (isEmpty(dir) || !fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
        return
    }
    const files = fs.readdirSync(dir)
    files.forEach(file => {
        if (file === '.git') return
        fs.rmSync(path.resolve(dir, file), { recursive: true, force: true })
    })

}

const ignoreMkdir = (dir: string) => {
    if (!fs.existsSync(dir) || isEmpty(dir)) {
        fs.mkdirSync(dir, { recursive: true })
        return
    }
}
const isValidPackageName = (projectName: string) => {
    return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(
        projectName,
    )
}

const toValidPackageName = (projectName: string) => {
    return projectName
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/^[._]/, '')
        .replace(/[^a-z\d\-~]+/g, '-')
}

const getConfigFile = (file: string, projectName: string) => {
    const config = JSON.parse(fs.readFileSync(file, 'utf-8'))
    const configJSON = getConfigJSON(projectName)
    Object.keys(configJSON).forEach(key => {
        if (Reflect.has(config, key)) {
            config[key] = configJSON[key]
        }
    })
    return JSON.stringify(config, null, 2)
}

const write = (templateDir: string, root: string, { packageName, projectName }: { packageName: string, projectName: string }) => {
    const templateFiles = fs.readdirSync(templateDir)

    templateFiles.forEach(file => {
        const newFile = renameFiles[file] ?? file
        const originPath = path.resolve(templateDir, `./${file}`)
        const targetPath = path.resolve(root, `./${newFile}`)

        if (newFile === 'config.json') {
            const content = getConfigFile(originPath, projectName)

            fs.writeFileSync(targetPath, content)
            return
        }
        const fileState = fs.statSync(path.resolve(templateDir, `./${file}`))

        if (fileState.isDirectory()) {
            fs.mkdirSync(targetPath)
            write(originPath, targetPath, { packageName, projectName })
        } else {
            fs.copyFileSync(originPath, targetPath)
        }

    })
}

const pkgFromUserAgent = (info: string) => {
    const arr = info.split(" ")[0].split("/")
    return {
        name: arr[0],
        version: arr[1]
    }
}

init().catch(e => {
    console.log(`项目创建失败: `, e);
})