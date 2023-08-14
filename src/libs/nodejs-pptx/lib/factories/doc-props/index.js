const { AppFactory } = require('./app.js')
const { CoreFactory } = require('./core.js')
const fs = require('fs')

class DocPropsFactory {
    constructor(parentFactory, args) {
        this.parentFactory = parentFactory
        this.content = parentFactory.content
        this.args = args
        this.appFactory = new AppFactory(this, args)
        this.coreFactory = new CoreFactory(this, args)
    }

    build(args) {
        this.appFactory.build()
        this.coreFactory.build()

        this.content['docProps/thumbnail.jpeg'] = fs.readFileSync(
            `${__dirname}/../../fragments/docProps/thumbnail.jpeg`,
        )
    }

    setProperties(props) {
        this.coreFactory.setProperties(props)
        this.appFactory.setProperties(props)
    }

    getProperties() {
        const coreProps = this.coreFactory.getProperties()
        const appProps = this.appFactory.getProperties()

        return {
            company: appProps.company,
            title: coreProps.title,
            author: coreProps.author,
            revision: coreProps.revision,
            subject: coreProps.subject,
        }
    }

    incrementSlideCount() {
        this.appFactory.incrementSlideCount()
    }

    decrementSlideCount() {
        this.appFactory.decrementSlideCount()
    }

    setSlideCount(count) {
        this.appFactory.setSlideCount(count)
    }
}

module.exports.DocPropsFactory = DocPropsFactory
